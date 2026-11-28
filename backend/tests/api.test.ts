import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, before, test, type TestContext } from "node:test";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const TEST_SECRET = "backend-api-tests-only-secret";
const USER_ID = "64b000000000000000000001";
const OTHER_ID = "64b000000000000000000002";
const JOB_ID = "64b000000000000000000003";
const APPLICATION_ID = "64b000000000000000000004";
const CLIENT_ID = "64b000000000000000000005";
const OTHER_JOB_ID = "64b000000000000000000006";

type TestApp = typeof import("../src/app").default;
type UserModel = typeof import("../src/models/User").default;
type UserRole = import("../src/models/User").UserRole;
type CandidateModel = typeof import("../src/models/Candidate").default;
type PendingCandidateModel =
  typeof import("../src/models/PendingCandidate").default;
type ClientModel = typeof import("../src/models/Client").default;
type JobModel = typeof import("../src/models/Job").default;
type ApplicationModel = typeof import("../src/models/Application").default;
type ApplicationNoteModel =
  typeof import("../src/models/ApplicationNote").default;
type StatusHistoryModel =
  typeof import("../src/models/ApplicationStatusHistory").default;
type VerificationModel =
  typeof import("../src/models/ApplicationVerification").default;

let app: TestApp;
let User: UserModel;
let Candidate: CandidateModel;
let PendingCandidate: PendingCandidateModel;
let Client: ClientModel;
let Job: JobModel;
let Application: ApplicationModel;
let ApplicationNote: ApplicationNoteModel;
let ApplicationStatusHistory: StatusHistoryModel;
let ApplicationVerification: VerificationModel;
let baseUrl: string;
let server: ReturnType<TestApp["listen"]>;

before(async () => {
  process.env.JWT_SECRET = TEST_SECRET;
  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/adp_softech_test";
  process.env.NODE_ENV = "production";
  process.env.SMTP_HOST = "smtp.test.local";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_FROM = "no-reply@example.com";
  process.env.SMTP_SECURE = "false";

  const [
    appModule,
    userModule,
    candidateModule,
    pendingCandidateModule,
    clientModule,
    jobModule,
    applicationModule,
    applicationNoteModule,
    statusHistoryModule,
    verificationModule,
  ] = await Promise.all([
    import("../src/app"),
    import("../src/models/User"),
    import("../src/models/Candidate"),
    import("../src/models/PendingCandidate"),
    import("../src/models/Client"),
    import("../src/models/Job"),
    import("../src/models/Application"),
    import("../src/models/ApplicationNote"),
    import("../src/models/ApplicationStatusHistory"),
    import("../src/models/ApplicationVerification"),
  ]);

  app = appModule.default;
  User = userModule.default;
  Candidate = candidateModule.default;
  PendingCandidate = pendingCandidateModule.default;
  Client = clientModule.default;
  Job = jobModule.default;
  Application = applicationModule.default;
  ApplicationNote = applicationNoteModule.default;
  ApplicationStatusHistory = statusHistoryModule.default;
  ApplicationVerification = verificationModule.default;

  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

const tokenFor = (role: "super_admin" | "recruiter", userId = USER_ID) =>
  jwt.sign({ userId, role }, TEST_SECRET, { expiresIn: "5m" });

const send = (
  path: string,
  options: {
    method?: string;
    token?: string;
    body?: unknown;
  } = {}
) =>
  fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
      ...(options.body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body:
      options.body === undefined
        ? undefined
        : JSON.stringify(options.body),
  });

const activeUserQuery = (role: "super_admin" | "recruiter" = "super_admin") => {
  const user = { _id: USER_ID, status: "active", role };
  return {
    select: async () => user,
    then: (
      resolve: (value: typeof user) => unknown,
      reject?: (reason: unknown) => unknown
    ) => Promise.resolve(user).then(resolve, reject),
  };
};

const stubActiveUser = (
  context: TestContext,
  role: UserRole = "super_admin"
) => {
  context.mock.method(
    User,
    "findById",
    (() => activeUserQuery(role)) as unknown as typeof User.findById
  );
};

const stubOwnedJobs = (context: TestContext, jobIds: string[]) => {
  const jobs = jobIds.map((_id) => ({ _id }));
  context.mock.method(
    Job,
    "find",
    (() => {
      const query = {
        select: () => query,
        session: () => query,
        then: (
          resolve: (value: typeof jobs) => unknown,
          reject?: (reason: unknown) => unknown
        ) => Promise.resolve(jobs).then(resolve, reject),
      };
      return query;
    }) as unknown as typeof Job.find
  );
};

const applicationResultQuery = <T>(result: T) => {
  const query = {
    populate: () => query,
    session: () => query,
    then: (
      resolve: (value: T) => unknown,
      reject?: (reason: unknown) => unknown
    ) => Promise.resolve(result).then(resolve, reject),
  };
  return query;
};

const json = async (response: Response) => response.json();

const createStatusTransactionHarness = (
  context: TestContext,
  failure: "update" | "history" | undefined
) => {
  const application = {
    _id: APPLICATION_ID,
    status: "new_application",
    job: JOB_ID,
  };
  const histories: Record<string, unknown>[] = [];
  let sessionEnded = false;
  const session = {
    withTransaction: async (operation: () => Promise<void>) => {
      const previousStatus = application.status;
      const previousHistoryCount = histories.length;
      try {
        await operation();
      } catch (error) {
        application.status = previousStatus;
        histories.length = previousHistoryCount;
        throw error;
      }
    },
    endSession: async () => {
      sessionEnded = true;
    },
  };

  context.mock.method(
    mongoose,
    "startSession",
    (async () => session) as unknown as typeof mongoose.startSession
  );
  context.mock.method(
    Application,
    "findOne",
    (() => {
      const query = {
        populate: () => query,
        session: () => query,
        then: (
          resolve: (value: typeof application) => unknown,
          reject?: (reason: unknown) => unknown
        ) => Promise.resolve(application).then(resolve, reject),
      };
      return query;
    }) as unknown as typeof Application.findOne
  );
  context.mock.method(
    Application,
    "findOneAndUpdate",
    ((_filter: Record<string, unknown>, update: { status: string }) => {
      const query = {
        populate: () => query,
        session: () => query,
        then: (
          resolve: (value: typeof application) => unknown,
          reject?: (reason: unknown) => unknown
        ) =>
          Promise.resolve().then(() => {
            application.status = update.status;
            if (failure === "update") {
              throw new Error("status update failed");
            }
            return application;
          }).then(resolve, reject),
      };
      return query;
    }) as unknown as typeof Application.findOneAndUpdate
  );
  context.mock.method(
    ApplicationStatusHistory.prototype,
    "save",
    (async function (
      this: { application?: unknown; previousStatus?: unknown; newStatus?: unknown },
      options?: { session?: typeof session }
    ) {
      assert.equal(options?.session, session);
      if (failure === "history") {
        throw new Error("history creation failed");
      }
      histories.push({
        application: this.application,
        previousStatus: this.previousStatus,
        newStatus: this.newStatus,
      });
      return this;
    }) as unknown as typeof ApplicationStatusHistory.prototype.save
  );

  return {
    application,
    histories,
    session,
    get sessionEnded() {
      return sessionEnded;
    },
  };
};

test("health endpoint responds without authentication", async () => {
  const response = await send("/api/health");
  assert.equal(response.status, 200);
  assert.equal((await json(response)).status, "healthy");
});

test("dashboard returns MongoDB aggregate metrics for Super Admin", async (context) => {
  stubActiveUser(context, "super_admin");
  let jobPipeline: unknown[] | undefined;
  let applicationPipeline: unknown[] | undefined;
  context.mock.method(
    Job,
    "aggregate",
    (async (pipeline: unknown[]) => {
      jobPipeline = pipeline;
      return [
        {
          scopedJobs: [{ _id: JOB_ID }],
          activeJDs: [{ count: 2 }],
        },
      ];
    }) as unknown as typeof Job.aggregate
  );
  context.mock.method(
    Application,
    "aggregate",
    (async (pipeline: unknown[]) => {
      applicationPipeline = pipeline;
      return [
        {
          summary: [
            {
              newApplications: 8,
              shortlisted: 2,
              interviewScheduled: 1,
              submittedToClient: 1,
              selected: 1,
              rejected: 2,
              onHold: 1,
            },
          ],
          applicationsByJD: [
            {
              jobId: "ADP-JD-1001",
              jobTitle: "Backend Engineer",
              applicationCount: 8,
            },
          ],
        },
      ];
    }) as unknown as typeof Application.aggregate
  );
  context.mock.method(
    Candidate,
    "aggregate",
    (async () => [{ count: 6 }]) as unknown as typeof Candidate.aggregate
  );

  const response = await send("/api/dashboard", {
    token: tokenFor("super_admin"),
  });
  assert.equal(response.status, 200);
  assert.deepEqual((await json(response)).dashboard, {
    activeJDs: 2,
    newApplications: 8,
    totalCandidates: 6,
    applicationsByJD: [
      {
        jobId: "ADP-JD-1001",
        jobTitle: "Backend Engineer",
        applicationCount: 8,
      },
    ],
    shortlisted: 2,
    interviewScheduled: 1,
    submittedToClient: 1,
    selected: 1,
    rejected: 2,
    onHold: 1,
  });
  assert.deepEqual((jobPipeline?.[0] as { $match: unknown }).$match, {});
  assert.ok(applicationPipeline);
  assert.equal(
    "$facet" in (applicationPipeline?.[1] as Record<string, unknown>),
    true
  );
});

test("dashboard applies date, recruiter, client, and job filters", async (context) => {
  stubActiveUser(context, "super_admin");
  let jobPipeline: unknown[] | undefined;
  let applicationPipeline: unknown[] | undefined;
  context.mock.method(
    Job,
    "aggregate",
    (async (pipeline: unknown[]) => {
      jobPipeline = pipeline;
      return [
        {
          scopedJobs: [{ _id: JOB_ID }],
          activeJDs: [{ count: 1 }],
        },
      ];
    }) as unknown as typeof Job.aggregate
  );
  context.mock.method(
    Application,
    "aggregate",
    (async (pipeline: unknown[]) => {
      applicationPipeline = pipeline;
      return [{ summary: [], candidateCount: [], applicationsByJD: [] }];
    }) as unknown as typeof Application.aggregate
  );

  const response = await send(
    `/api/dashboard?startDate=2026-03-01&endDate=2026-03-31&recruiterId=${OTHER_ID}&clientId=${CLIENT_ID}&jobId=${OTHER_JOB_ID}`,
    { token: tokenFor("super_admin") }
  );
  assert.equal(response.status, 200);

  const jobMatch = (jobPipeline?.[0] as { $match: Record<string, unknown> })
    .$match;
  assert.deepEqual(jobMatch, {
    $and: [
      { recruiterOwner: new mongoose.Types.ObjectId(OTHER_ID) },
      { client: new mongoose.Types.ObjectId(CLIENT_ID) },
      { _id: new mongoose.Types.ObjectId(OTHER_JOB_ID) },
    ],
  });
  const applicationMatch = (
    applicationPipeline?.[0] as { $match: Record<string, unknown> }
  ).$match;
  assert.deepEqual(applicationMatch.appliedAt, {
    $gte: new Date("2026-03-01T00:00:00.000Z"),
    $lt: new Date("2026-04-01T00:00:00.000Z"),
  });

  const invalidDateRange = await send(
    "/api/dashboard?startDate=2026-04-01&endDate=2026-03-01",
    { token: tokenFor("super_admin") }
  );
  assert.equal(invalidDateRange.status, 400);
});

test("dashboard limits Recruiters to owned jobs and rejects another recruiter filter", async (context) => {
  stubActiveUser(context, "recruiter");
  stubOwnedJobs(context, [JOB_ID]);
  let jobPipeline: unknown[] | undefined;
  let applicationPipeline: unknown[] | undefined;
  context.mock.method(
    Job,
    "aggregate",
    (async (pipeline: unknown[]) => {
      jobPipeline = pipeline;
      return [
        {
          scopedJobs: [{ _id: JOB_ID }],
          activeJDs: [{ count: 1 }],
        },
      ];
    }) as unknown as typeof Job.aggregate
  );
  context.mock.method(
    Application,
    "aggregate",
    (async (pipeline: unknown[]) => {
      applicationPipeline = pipeline;
      return [{ summary: [], candidateCount: [], applicationsByJD: [] }];
    }) as unknown as typeof Application.aggregate
  );

  const response = await send("/api/dashboard", {
    token: tokenFor("recruiter"),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(
    (jobPipeline?.[0] as { $match: Record<string, unknown> }).$match,
    { _id: { $in: [JOB_ID] } }
  );
  assert.deepEqual(
    (applicationPipeline?.[0] as { $match: Record<string, unknown> }).$match
      .job,
    { $in: [JOB_ID] }
  );

  const forbiddenFilter = await send(
    `/api/dashboard?recruiterId=${OTHER_ID}`,
    { token: tokenFor("recruiter") }
  );
  assert.equal(forbiddenFilter.status, 403);
});

test("authentication and role guards reject missing and disallowed users", async (context) => {
  const missingToken = await send("/api/clients");
  assert.equal(missingToken.status, 401);

  const malformedToken = await send("/api/clients", {
    token: "malformed-token",
  });
  assert.equal(malformedToken.status, 401);

  context.mock.method(
    User,
    "findById",
    (() => ({
      select: async () => ({ status: "suspended" }),
    })) as unknown as typeof User.findById
  );
  const inactive = await send("/api/clients", {
    token: tokenFor("super_admin"),
  });
  assert.equal(inactive.status, 401);

  stubActiveUser(context, "recruiter");
  const recruiterToken = tokenFor("recruiter");
  const forbidden = await send("/api/clients", { token: recruiterToken });
  assert.equal(forbidden.status, 403);

  context.mock.method(
    User,
    "findById",
    (() => activeUserQuery("super_admin")) as unknown as typeof User.findById
  );
  context.mock.method(
    Client,
    "find",
    (() =>
      ({
        sort: async () => [],
      }) as unknown as ReturnType<typeof Client.find>) as typeof Client.find
  );

  const allowed = await send("/api/clients", {
    token: tokenFor("super_admin"),
  });
  assert.equal(allowed.status, 200);
  assert.deepEqual((await json(allowed)).clients, []);
});

test("login rejects invalid credentials and returns no password on success", async (context) => {
  context.mock.method(
    User,
    "findOne",
    (() => ({
      select: async () => ({
        _id: { toString: () => USER_ID },
        name: "Test Recruiter",
        email: "recruiter@example.com",
        password: "hashed-password",
        role: "recruiter",
        status: "active",
        save: async () => undefined,
      }),
    })) as unknown as typeof User.findOne
  );
  context.mock.method(bcrypt, "compare", async () => true);

  const invalid = await send("/api/auth/login", {
    method: "POST",
    body: { email: "not-an-email", password: "" },
  });
  assert.equal(invalid.status, 400);

  const response = await send("/api/auth/login", {
    method: "POST",
    body: { email: " RECRUITER@example.com ", password: "password" },
  });
  assert.equal(response.status, 200);
  const data = await json(response);
  assert.equal(data.data.user.email, "recruiter@example.com");
  assert.equal("password" in data.data.user, false);
  assert.equal(typeof data.data.token, "string");
});

test("candidate intake requires consent and stores normalized pending data", async (context) => {
  const invalid = await send("/api/candidates", {
    method: "POST",
    body: { fullName: "Candidate", email: "not-an-email", mobileNumber: "1234567890" },
  });
  assert.equal(invalid.status, 400);

  const missingConsent = await send("/api/candidates", {
    method: "POST",
    body: {
      fullName: "Candidate Person",
      email: "candidate@example.com",
      mobileNumber: "1234567890",
    },
  });
  assert.equal(missingConsent.status, 400);

  const tooShortMobile = await send("/api/candidates", {
    method: "POST",
    body: {
      fullName: "Candidate Person",
      email: "candidate@example.com",
      mobileNumber: "123",
      consent: true,
    },
  });
  assert.equal(tooShortMobile.status, 400);

  const savedIntakes: Record<string, unknown>[] = [];
  context.mock.method(
    Candidate,
    "findOne",
    (async () => null) as unknown as typeof Candidate.findOne
  );
  context.mock.method(
    PendingCandidate,
    "create",
    (async (data: Record<string, unknown>) => {
      savedIntakes.push(data);
      return { ...data, _id: savedIntakes.length === 1 ? USER_ID : OTHER_ID };
    }) as unknown as typeof PendingCandidate.create
  );
  context.mock.method(
    Candidate,
    "create",
    (async () => {
      throw new Error("Unverified intake must not create a candidate");
    }) as unknown as typeof Candidate.create
  );

  const body = {
    fullName: "Candidate Person",
    email: " Candidate@Example.com ",
    mobileNumber: " 1234567890 ",
    consent: true,
  };
  const first = await send("/api/candidates", { method: "POST", body });
  const second = await send("/api/candidates", { method: "POST", body });
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  assert.equal(savedIntakes.length, 2);
  assert.equal(savedIntakes[0].email, "candidate@example.com");
  assert.equal(savedIntakes[0].mobileNumber, "1234567890");
  assert.equal(savedIntakes[0].consent, true);
  assert.ok(savedIntakes[0].consentAt instanceof Date);
  assert.ok(savedIntakes[0].expiresAt instanceof Date);

  let duplicateLookup: Record<string, unknown> | undefined;
  context.mock.method(
    Candidate,
    "findOne",
    (async (filter: Record<string, unknown>) => {
      duplicateLookup = filter;
      return {
        _id: OTHER_ID,
        email: "candidate@example.com",
        mobileNumber: "1234567890",
        consent: true,
        consentAt: new Date(),
        expiresAt: new Date(Date.now() + 60_000),
      };
    }) as unknown as typeof Candidate.findOne
  );
  const duplicate = await send("/api/candidates", {
    method: "POST",
    body: {
      ...body,
      email: " CANDIDATE@EXAMPLE.COM ",
      mobileNumber: " 1234567890 ",
    },
  });
  assert.equal(duplicate.status, 409);
  assert.deepEqual(duplicateLookup, {
    $or: [
      { email: "candidate@example.com" },
      { mobileNumber: "1234567890" },
    ],
  });
});

test("client API validates payload and preserves duplicate response", async (context) => {
  stubActiveUser(context);
  const token = tokenFor("super_admin");

  const invalid = await send("/api/clients", {
    method: "POST",
    token,
    body: {
      companyName: "Valid Company",
      contactPerson: "Contact Person",
      contactEmail: "bad-email",
    },
  });
  assert.equal(invalid.status, 400);

  context.mock.method(
    Client,
    "findOne",
    (async () => ({ _id: OTHER_ID })) as unknown as typeof Client.findOne
  );
  const duplicate = await send("/api/clients", {
    method: "POST",
    token,
    body: {
      companyName: "Valid Company",
      contactPerson: "Contact Person",
      contactEmail: "contact@example.com",
    },
  });
  assert.equal(duplicate.status, 409);
  assert.equal(
    (await json(duplicate)).message,
    "Client with this email already exists"
  );

  context.mock.method(
    Client,
    "findOne",
    (async () => null) as unknown as typeof Client.findOne
  );
  context.mock.method(
    Client,
    "create",
    (async () => {
      throw Object.assign(new Error("duplicate key"), { code: 11000 });
    }) as unknown as typeof Client.create
  );
  const concurrentDuplicate = await send("/api/clients", {
    method: "POST",
    token,
    body: {
      companyName: "Another Company",
      contactPerson: "Contact Person",
      contactEmail: "contact@example.com",
    },
  });
  assert.equal(concurrentDuplicate.status, 409);
});

test("client read, update, status, and delete routes succeed with isolated model stubs", async (context) => {
  stubActiveUser(context);
  const token = tokenFor("super_admin");
  const storedClient = {
    _id: OTHER_ID,
    companyName: "Original Company",
    contactPerson: "Contact Person",
    contactEmail: "contact@example.com",
    status: "active",
    save: async () => undefined,
  };
  context.mock.method(
    Client,
    "findById",
    (async () => storedClient) as unknown as typeof Client.findById
  );
  context.mock.method(
    Client,
    "findByIdAndDelete",
    (async () => storedClient) as unknown as typeof Client.findByIdAndDelete
  );

  const getResponse = await send(`/api/clients/${OTHER_ID}`, { token });
  assert.equal(getResponse.status, 200);

  const updateResponse = await send(`/api/clients/${OTHER_ID}`, {
    method: "PATCH",
    token,
    body: { companyName: "Updated Company" },
  });
  assert.equal(updateResponse.status, 200);
  assert.equal(storedClient.companyName, "Updated Company");

  const statusResponse = await send(`/api/clients/${OTHER_ID}/status`, {
    method: "PATCH",
    token,
    body: { status: "inactive" },
  });
  assert.equal(statusResponse.status, 200);
  assert.equal(storedClient.status, "inactive");

  const deleteResponse = await send(`/api/clients/${OTHER_ID}`, {
    method: "DELETE",
    token,
  });
  assert.equal(deleteResponse.status, 200);
});

test("job routes scope recruiter list and mutations to JWT ownership", async (context) => {
  stubActiveUser(context, "recruiter");
  const token = tokenFor("recruiter");
  const seenFilters: Record<string, unknown>[] = [];

  context.mock.method(
    Job,
    "find",
    ((filter: Record<string, unknown>) => {
      seenFilters.push(filter);
      return {
        populate() {
          return this;
        },
        sort: async () => [],
      };
    }) as unknown as typeof Job.find
  );
  context.mock.method(
    Job,
    "findOneAndUpdate",
    ((filter: Record<string, unknown>) => {
      seenFilters.push(filter);
      return Promise.resolve({ _id: JOB_ID, jobTitle: "Engineer" });
    }) as unknown as typeof Job.findOneAndUpdate
  );
  context.mock.method(
    Job,
    "findOneAndDelete",
    ((filter: Record<string, unknown>) => {
      seenFilters.push(filter);
      return Promise.resolve({ _id: JOB_ID, jobTitle: "Engineer" });
    }) as unknown as typeof Job.findOneAndDelete
  );

  const listResponse = await send("/api/jobs", { token });
  assert.equal(listResponse.status, 200);
  assert.equal(seenFilters[0]?.recruiterOwner, USER_ID);

  for (const [path, body] of [
    [`/api/jobs/${JOB_ID}`, { jobTitle: "Updated Engineer" }],
    [`/api/jobs/${JOB_ID}/status`, { status: "active" }],
    [`/api/jobs/${JOB_ID}/publication`, { isPublished: true }],
  ] as const) {
    const response = await send(path, {
      method: "PATCH",
      token,
      body,
    });
    assert.equal(response.status, 200);
  }

  const deleted = await send(`/api/jobs/${JOB_ID}`, {
    method: "DELETE",
    token,
  });
  assert.equal(deleted.status, 200);
  assert.equal(seenFilters.length, 5);
  assert.ok(seenFilters.every((filter) => filter.recruiterOwner === USER_ID));

  context.mock.method(
    Job,
    "findOne",
    (() => ({
      populate() {
        return this;
      },
      then: (
        resolve: (value: null) => unknown,
        reject?: (reason: unknown) => unknown
      ) => Promise.resolve(null).then(resolve, reject),
    })) as unknown as typeof Job.findOne
  );
  const hiddenJob = await send(`/api/jobs/${JOB_ID}`, { token });
  assert.equal(hiddenJob.status, 404);
  assert.equal(seenFilters.at(-1)?.recruiterOwner, USER_ID);

  context.mock.method(
    User,
    "findById",
    (() => activeUserQuery("super_admin")) as unknown as typeof User.findById
  );
  const adminList = await send("/api/jobs", {
    token: tokenFor("super_admin"),
  });
  assert.equal(adminList.status, 200);
  assert.equal("recruiterOwner" in (seenFilters.at(-1) ?? {}), false);
});

test("recruiter job creation ignores a client-supplied owner", async (context) => {
  stubActiveUser(context, "recruiter");
  context.mock.method(
    Client,
    "findById",
    (() => ({
      then: (resolve: (value: object) => unknown) =>
        Promise.resolve({ _id: OTHER_ID }).then(resolve),
    })) as unknown as typeof Client.findById
  );
  context.mock.method(
    Job,
    "findOne",
    (() => ({
      sort: async () => null,
    })) as unknown as typeof Job.findOne
  );
  let createdJob: Record<string, unknown> | undefined;
  context.mock.method(
    Job,
    "create",
    (async (data: Record<string, unknown>) => {
      createdJob = data;
      return { _id: JOB_ID, ...data };
    }) as unknown as typeof Job.create
  );

  const response = await send("/api/jobs", {
    method: "POST",
    token: tokenFor("recruiter"),
    body: {
      jobTitle: "Engineer",
      client: OTHER_ID,
      minExperience: 1,
      maxExperience: 5,
      mandatorySkills: ["TypeScript"],
      location: "Remote",
      workMode: "remote",
      engagementType: "permanent",
      positions: 1,
      recruiterOwner: OTHER_ID,
    },
  });

  assert.equal(response.status, 201);
  assert.equal(createdJob?.recruiterOwner, USER_ID);
});

test("recruiter management routes enforce super-admin access and cover CRUD operations", async (context) => {
  const token = tokenFor("super_admin");
  const recruiter = {
    _id: OTHER_ID,
    name: "Original Recruiter",
    email: "original@example.com",
    password: "hashed-password",
    role: "recruiter",
    status: "active",
    createdAt: new Date("2025-01-01T00:00:00.000Z"),
    updatedAt: new Date("2025-01-01T00:00:00.000Z"),
    save: async () => undefined,
  };

  stubActiveUser(context, "recruiter");
  const forbidden = await send("/api/users/recruiters", {
    token: tokenFor("recruiter"),
  });
  assert.equal(forbidden.status, 403);

  stubActiveUser(context);
  context.mock.method(
    User,
    "find",
    (() => {
      const query = {
        select: () => query,
        sort: async () => [
          {
            _id: OTHER_ID,
            name: recruiter.name,
            email: recruiter.email,
            role: recruiter.role,
            status: recruiter.status,
          },
        ],
      };
      return query;
    }) as unknown as typeof User.find
  );
  const listResponse = await send("/api/users/recruiters", { token });
  assert.equal(listResponse.status, 200);
  const listData = await json(listResponse);
  assert.equal(listData.data.length, 1);
  assert.equal("password" in listData.data[0], false);

  const recruiterQuery = () => ({
    select: async (projection?: string) =>
      projection === "-password"
        ? Object.fromEntries(
            Object.entries(recruiter).filter(([key]) => key !== "password")
          )
        : recruiter,
    then: (
      resolve: (value: typeof recruiter) => unknown,
      reject?: (reason: unknown) => unknown
    ) => Promise.resolve(recruiter).then(resolve, reject),
  });
  context.mock.method(
    User,
    "findOne",
    (() => recruiterQuery()) as unknown as typeof User.findOne
  );

  const invalidId = await send("/api/users/recruiters/not-an-id", { token });
  assert.equal(invalidId.status, 400);
  const getResponse = await send(`/api/users/recruiters/${OTHER_ID}`, {
    token,
  });
  assert.equal(getResponse.status, 200);
  assert.equal("password" in (await json(getResponse)).data, false);

  const invalidUpdate = await send(`/api/users/recruiters/${OTHER_ID}`, {
    method: "PATCH",
    token,
    body: { email: "not-an-email" },
  });
  assert.equal(invalidUpdate.status, 400);

  context.mock.method(
    User,
    "findOne",
    ((filter: Record<string, unknown>) => {
      if ("email" in filter) {
        return {
          then: (
            resolve: (value: null) => unknown,
            reject?: (reason: unknown) => unknown
          ) => Promise.resolve(null).then(resolve, reject),
        };
      }
      return recruiterQuery();
    }) as unknown as typeof User.findOne
  );
  const updateResponse = await send(`/api/users/recruiters/${OTHER_ID}`, {
    method: "PATCH",
    token,
    body: { name: "Updated Recruiter", email: " UPDATED@example.com " },
  });
  assert.equal(updateResponse.status, 200);
  assert.equal(recruiter.name, "Updated Recruiter");
  assert.equal(recruiter.email, "updated@example.com");
  assert.equal("password" in (await json(updateResponse)).data, false);

  context.mock.method(
    User,
    "findOneAndUpdate",
    (() => ({
      select: async () => ({ ...recruiter, status: "inactive" }),
    })) as unknown as typeof User.findOneAndUpdate
  );
  const invalidStatus = await send(
    `/api/users/recruiters/${OTHER_ID}/status`,
    { method: "PATCH", token, body: { status: "suspended" } }
  );
  assert.equal(invalidStatus.status, 400);
  const statusResponse = await send(
    `/api/users/recruiters/${OTHER_ID}/status`,
    { method: "PATCH", token, body: { status: "inactive" } }
  );
  assert.equal(statusResponse.status, 200);
  assert.equal((await json(statusResponse)).data.status, "inactive");

  const invalidPassword = await send(
    `/api/users/recruiters/${OTHER_ID}/reset-password`,
    { method: "PATCH", token, body: { password: "weak" } }
  );
  assert.equal(invalidPassword.status, 400);
  const resetResponse = await send(
    `/api/users/recruiters/${OTHER_ID}/reset-password`,
    { method: "PATCH", token, body: { password: "StrongPass123" } }
  );
  assert.equal(resetResponse.status, 200);
  assert.equal("password" in (await json(resetResponse)).data, false);
  assert.notEqual(recruiter.password, "StrongPass123");
});

test("application submission requires a verification code and invalid filters fail validation", async (context) => {
  const missingCode = await send("/api/applications", {
    method: "POST",
    body: { candidateId: USER_ID, jobId: JOB_ID },
  });
  assert.equal(missingCode.status, 400);

  stubActiveUser(context);
  const invalidStatus = await send("/api/applications?status=not-a-status", {
    token: tokenFor("super_admin"),
  });
  assert.equal(invalidStatus.status, 400);

  const invalidStatusChange = await send(
    `/api/applications/${APPLICATION_ID}/status`,
    {
      method: "PATCH",
      token: tokenFor("super_admin"),
      body: { status: "invalid_status" },
    }
  );
  assert.equal(invalidStatusChange.status, 400);

  const invalidNote = await send("/api/application-notes", {
    method: "POST",
    token: tokenFor("super_admin"),
    body: { applicationId: APPLICATION_ID, note: " " },
  });
  assert.equal(invalidNote.status, 400);

  const invalidHistoryId = await send(
    "/api/application-status-history/not-an-id",
    { token: tokenFor("super_admin") }
  );
  assert.equal(invalidHistoryId.status, 400);
});

test("application duplicate submission is rejected after verification consumption", async (context) => {
  context.mock.method(
    Job,
    "findById",
    (async () => ({ _id: JOB_ID, status: "active", isPublished: true })) as unknown as typeof Job.findById
  );
  context.mock.method(
    Candidate,
    "findById",
    (async () => ({
      _id: USER_ID,
      consent: true,
      consentAt: new Date(),
    })) as unknown as typeof Candidate.findById
  );
  context.mock.method(
    ApplicationVerification,
    "findOneAndDelete",
    (async () => ({ _id: OTHER_ID })) as unknown as typeof ApplicationVerification.findOneAndDelete
  );
  context.mock.method(
    Application,
    "findOne",
    (async () => ({ _id: APPLICATION_ID })) as unknown as typeof Application.findOne
  );

  const response = await send("/api/applications", {
    method: "POST",
    body: {
      candidateId: USER_ID,
      jobId: JOB_ID,
      verificationCode: "123456",
    },
  });

  assert.equal(response.status, 400);
  assert.equal(
    (await json(response)).message,
    "Candidate has already applied for this job"
  );
});

test("public application submission still succeeds after email verification", async (context) => {
  const job = { _id: JOB_ID, status: "active", isPublished: true };
  const pendingCandidate = {
    _id: USER_ID,
    fullName: "Candidate Person",
    email: "candidate@example.com",
    mobileNumber: "1234567890",
    consent: true,
    consentAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  };
  let verificationConsumed = false;
  let createdApplication: Record<string, unknown> | undefined;
  context.mock.method(
    Job,
    "findById",
    (async () => job) as unknown as typeof Job.findById
  );
  context.mock.method(
    Candidate,
    "findById",
    (async () => null) as unknown as typeof Candidate.findById
  );
  context.mock.method(
    PendingCandidate,
    "findById",
    (async () => pendingCandidate) as unknown as typeof PendingCandidate.findById
  );
  context.mock.method(
    Candidate,
    "findOne",
    (async () => null) as unknown as typeof Candidate.findOne
  );
  context.mock.method(
    Candidate,
    "create",
    (async (data: Record<string, unknown>) => {
      assert.equal(verificationConsumed, true);
      assert.equal(data.consent, true);
      assert.ok(data.consentAt instanceof Date);
      return { ...data, _id: USER_ID };
    }) as unknown as typeof Candidate.create
  );
  context.mock.method(
    ApplicationVerification,
    "findOneAndDelete",
    (async () => {
      verificationConsumed = true;
      return { _id: OTHER_ID };
    }) as unknown as typeof ApplicationVerification.findOneAndDelete
  );
  context.mock.method(
    Application,
    "findOne",
    (() => {
      const query = {
        sort: async () => null,
        then: (
          resolve: (value: null) => unknown,
          reject?: (reason: unknown) => unknown
        ) => Promise.resolve(null).then(resolve, reject),
      };
      return query;
    }) as unknown as typeof Application.findOne
  );
  context.mock.method(
    Application,
    "create",
    (async (data: Record<string, unknown>) => {
      createdApplication = { ...data, _id: APPLICATION_ID };
      return createdApplication;
    }) as unknown as typeof Application.create
  );

  const response = await send("/api/applications", {
    method: "POST",
    body: {
      candidateId: USER_ID,
      jobId: JOB_ID,
      verificationCode: "123456",
    },
  });
  assert.equal(response.status, 201);
  const result = await json(response);
  assert.match(
    String(createdApplication?.applicationId),
    /^ADP-APP-\d{8}-0001$/
  );
  assert.equal(result.application.candidate, USER_ID);
  assert.equal(result.application.job, JOB_ID);
});

test("verified candidate intake reuses an existing candidate after normalization", async (context) => {
  const pendingCandidate = {
    _id: USER_ID,
    fullName: "Candidate Person",
    email: "candidate@example.com",
    mobileNumber: "1234567890",
    consent: true,
    consentAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  };
  const existingCandidate = {
    _id: OTHER_ID,
    fullName: "Candidate Person",
    email: "candidate@example.com",
    mobileNumber: "1234567890",
    consent: false,
    consentAt: undefined as Date | undefined,
    save: async function () {
      return this;
    },
  };
  let createdApplication: Record<string, unknown> | undefined;
  context.mock.method(
    Job,
    "findById",
    (async () => ({ _id: JOB_ID, status: "active", isPublished: true })) as unknown as typeof Job.findById
  );
  context.mock.method(
    Candidate,
    "findById",
    (async () => null) as unknown as typeof Candidate.findById
  );
  context.mock.method(
    PendingCandidate,
    "findById",
    (async () => pendingCandidate) as unknown as typeof PendingCandidate.findById
  );
  context.mock.method(
    Candidate,
    "findOne",
    (async (filter: Record<string, unknown>) => {
      assert.deepEqual(filter, {
        $or: [
          { email: "candidate@example.com" },
          { mobileNumber: "1234567890" },
        ],
      });
      return existingCandidate;
    }) as unknown as typeof Candidate.findOne
  );
  context.mock.method(
    ApplicationVerification,
    "findOneAndDelete",
    (async () => ({ _id: APPLICATION_ID })) as unknown as typeof ApplicationVerification.findOneAndDelete
  );
  context.mock.method(
    Application,
    "findOne",
    (() => ({
      sort: async () => null,
      then: (
        resolve: (value: null) => unknown,
        reject?: (reason: unknown) => unknown
      ) => Promise.resolve(null).then(resolve, reject),
    })) as unknown as typeof Application.findOne
  );
  context.mock.method(
    Application,
    "create",
    (async (data: Record<string, unknown>) => {
      createdApplication = { ...data, _id: APPLICATION_ID };
      return createdApplication;
    }) as unknown as typeof Application.create
  );

  const response = await send("/api/applications", {
    method: "POST",
    body: {
      candidateId: USER_ID,
      jobId: JOB_ID,
      verificationCode: "123456",
    },
  });

  assert.equal(response.status, 201);
  assert.equal(existingCandidate.consent, true);
  assert.ok(existingCandidate.consentAt instanceof Date);
  assert.equal(createdApplication?.candidate, OTHER_ID);
});

test("application verification sends a mocked email and returns a generic response", async (context) => {
  const candidate = {
    _id: USER_ID,
    email: "candidate@example.com",
    consent: true,
    consentAt: new Date(),
    expiresAt: new Date(Date.now() + 60_000),
  };
  const job = { _id: JOB_ID, status: "active", isPublished: true };
  context.mock.method(
    Candidate,
    "findById",
    (() => ({ select: async () => null })) as unknown as typeof Candidate.findById
  );
  context.mock.method(
    PendingCandidate,
    "findById",
    (() => ({ select: async () => candidate })) as unknown as typeof PendingCandidate.findById
  );
  context.mock.method(
    Job,
    "findById",
    (() => ({ select: async () => job })) as unknown as typeof Job.findById
  );
  context.mock.method(
    Application,
    "exists",
    (async () => null) as unknown as typeof Application.exists
  );
  context.mock.method(
    ApplicationVerification,
    "findOneAndUpdate",
    (async () => null) as unknown as typeof ApplicationVerification.findOneAndUpdate
  );
  context.mock.method(
    ApplicationVerification,
    "create",
    (async () => ({ _id: OTHER_ID })) as unknown as typeof ApplicationVerification.create
  );
  context.mock.method(
    ApplicationVerification,
    "updateOne",
    (async () => ({ acknowledged: true, modifiedCount: 1 })) as unknown as typeof ApplicationVerification.updateOne
  );
  context.mock.method(
    PendingCandidate,
    "updateOne",
    (async () => ({ acknowledged: true, modifiedCount: 1 })) as unknown as typeof PendingCandidate.updateOne
  );

  let sentMessage: { to: string; text: string } | undefined;
  context.mock.method(
    nodemailer,
    "createTransport",
    (() => ({
      sendMail: async (message: { to: string; text: string }) => {
        sentMessage = message;
        return { messageId: "test-message" };
      },
    })) as unknown as typeof nodemailer.createTransport
  );

  const response = await send("/api/applications/verification", {
    method: "POST",
    body: { candidateId: USER_ID, jobId: JOB_ID },
  });

  assert.equal(response.status, 202);
  const responseText = JSON.stringify(await json(response));
  assert.doesNotMatch(responseText, /\b\d{6}\b/);
  assert.equal(sentMessage?.to, "candidate@example.com");
  assert.match(sentMessage?.text ?? "", /\b\d{6}\b/);
});

test("application notes can be created and retrieved with the authenticated author", async (context) => {
  stubActiveUser(context, "recruiter");
  stubOwnedJobs(context, [JOB_ID]);
  const application = { _id: APPLICATION_ID };
  const createdNote = {
    _id: OTHER_ID,
    application: APPLICATION_ID,
    recruiter: USER_ID,
    note: "Interview feedback",
  };
  const savedNotes = [createdNote];
  context.mock.method(
    Application,
    "findOne",
    (async () => application) as unknown as typeof Application.findOne
  );
  context.mock.method(
    ApplicationNote,
    "create",
    (async (data: Record<string, unknown>) => {
      assert.equal(data.recruiter, USER_ID);
      assert.equal(data.application, APPLICATION_ID);
      return createdNote;
    }) as unknown as typeof ApplicationNote.create
  );
  context.mock.method(
    ApplicationNote,
    "find",
    ((filter: Record<string, unknown>) => {
      assert.equal(filter.application, APPLICATION_ID);
      const query = {
        populate: () => query,
        sort: async () => savedNotes,
      };
      return query;
    }) as unknown as typeof ApplicationNote.find
  );

  const createResponse = await send("/api/application-notes", {
    method: "POST",
    token: tokenFor("recruiter"),
    body: {
      applicationId: APPLICATION_ID,
      recruiterId: OTHER_ID,
      note: "Interview feedback",
    },
  });
  assert.equal(createResponse.status, 201);
  assert.equal((await json(createResponse)).applicationNote.recruiter, USER_ID);

  const getResponse = await send(
    `/api/application-notes/${APPLICATION_ID}`,
    { token: tokenFor("recruiter") }
  );
  assert.equal(getResponse.status, 200);
  assert.equal((await json(getResponse)).total, 1);
});

test("recruiters can list and retrieve only applications for their owned jobs", async (context) => {
  stubActiveUser(context, "recruiter");
  stubOwnedJobs(context, [JOB_ID]);
  const ownedApplication = {
    _id: APPLICATION_ID,
    job: JOB_ID,
    candidate: OTHER_ID,
  };

  context.mock.method(
    Application,
    "find",
    ((filter: Record<string, unknown>) => {
      assert.deepEqual(filter, {
        $and: [
          { job: JOB_ID },
          { job: { $in: [JOB_ID] } },
        ],
      });
      const query = {
        populate: () => query,
        sort: async () => [ownedApplication],
      };
      return query;
    }) as unknown as typeof Application.find
  );
  context.mock.method(
    Application,
    "findOne",
    ((filter: Record<string, unknown>) => {
      assert.deepEqual(filter, {
        _id: APPLICATION_ID,
        job: { $in: [JOB_ID] },
      });
      return applicationResultQuery(ownedApplication);
    }) as unknown as typeof Application.findOne
  );

  const listResponse = await send(
    `/api/applications?jobId=${JOB_ID}`,
    { token: tokenFor("recruiter") }
  );
  assert.equal(listResponse.status, 200);
  assert.equal((await json(listResponse)).applications[0].job, JOB_ID);

  const detailResponse = await send(`/api/applications/${APPLICATION_ID}`, {
    token: tokenFor("recruiter"),
  });
  assert.equal(detailResponse.status, 200);
  assert.equal((await json(detailResponse)).application._id, APPLICATION_ID);
});

test("recruiters receive not-found responses for another recruiter's application and related data", async (context) => {
  stubActiveUser(context, "recruiter");
  stubOwnedJobs(context, [JOB_ID]);
  context.mock.method(
    mongoose,
    "startSession",
    (async () => ({
      withTransaction: async (operation: () => Promise<void>) =>
        operation(),
      endSession: async () => undefined,
    })) as unknown as typeof mongoose.startSession
  );
  context.mock.method(
    Application,
    "findOne",
    (() => applicationResultQuery(null)) as unknown as typeof Application.findOne
  );
  let statusUpdateCalls = 0;
  context.mock.method(
    Application,
    "findOneAndUpdate",
    (() => {
      statusUpdateCalls += 1;
      return applicationResultQuery(null);
    }) as unknown as typeof Application.findOneAndUpdate
  );
  let noteReadCalls = 0;
  context.mock.method(
    ApplicationNote,
    "find",
    (() => {
      noteReadCalls += 1;
      return { populate: () => ({ sort: async () => [] }) };
    }) as unknown as typeof ApplicationNote.find
  );
  let historyReadCalls = 0;
  context.mock.method(
    ApplicationStatusHistory,
    "find",
    (() => {
      historyReadCalls += 1;
      return { populate: () => ({ sort: async () => [] }) };
    }) as unknown as typeof ApplicationStatusHistory.find
  );

  const detailResponse = await send(`/api/applications/${APPLICATION_ID}`, {
    token: tokenFor("recruiter"),
  });
  assert.equal(detailResponse.status, 404);
  assert.equal((await json(detailResponse)).message, "Application not found");

  const statusResponse = await send(
    `/api/applications/${APPLICATION_ID}/status`,
    {
      method: "PATCH",
      token: tokenFor("recruiter"),
      body: { status: "shortlisted" },
    }
  );
  assert.equal(statusResponse.status, 400);
  assert.equal((await json(statusResponse)).message, "Application not found");

  const noteResponse = await send("/api/application-notes", {
    method: "POST",
    token: tokenFor("recruiter"),
    body: { applicationId: APPLICATION_ID, note: "Private feedback" },
  });
  assert.equal(noteResponse.status, 404);
  assert.equal((await json(noteResponse)).message, "Application not found");

  const notesResponse = await send(
    `/api/application-notes/${APPLICATION_ID}`,
    { token: tokenFor("recruiter") }
  );
  assert.equal(notesResponse.status, 404);
  assert.equal((await json(notesResponse)).message, "Application not found");

  const historyResponse = await send(
    `/api/application-status-history/${APPLICATION_ID}`,
    { token: tokenFor("recruiter") }
  );
  assert.equal(historyResponse.status, 404);
  assert.equal((await json(historyResponse)).message, "Application not found");
  assert.equal(statusUpdateCalls, 0);
  assert.equal(noteReadCalls, 0);
  assert.equal(historyReadCalls, 0);
});

test("super admins retain access to applications across recruiter ownership", async (context) => {
  stubActiveUser(context);
  stubOwnedJobs(context, []);
  const harness = createStatusTransactionHarness(context, undefined);
  harness.application.job = OTHER_ID;
  context.mock.method(
    Application,
    "find",
    ((filter: Record<string, unknown>) => {
      assert.deepEqual(filter, {});
      const query = {
        populate: () => query,
        sort: async () => [harness.application],
      };
      return query;
    }) as unknown as typeof Application.find
  );

  const listResponse = await send("/api/applications", {
    token: tokenFor("super_admin"),
  });
  assert.equal(listResponse.status, 200);
  assert.equal((await json(listResponse)).applications[0].job, OTHER_ID);

  const detailResponse = await send(`/api/applications/${APPLICATION_ID}`, {
    token: tokenFor("super_admin"),
  });
  assert.equal(detailResponse.status, 200);

  const statusResponse = await send(
    `/api/applications/${APPLICATION_ID}/status`,
    {
      method: "PATCH",
      token: tokenFor("super_admin"),
      body: { status: "shortlisted" },
    }
  );
  assert.equal(statusResponse.status, 200);
  assert.equal(harness.application.status, "shortlisted");
});

test("status updates and history retrieval succeed in the same transaction flow", async (context) => {
  stubActiveUser(context);
  const harness = createStatusTransactionHarness(context, undefined);
  const { updateApplicationStatus } = await import(
    "../src/services/application.service"
  );

  const updateResponse = await send(
    `/api/applications/${APPLICATION_ID}/status`,
    {
      method: "PATCH",
      token: tokenFor("super_admin"),
      body: { status: "shortlisted", remarks: "Meets requirements" },
    }
  );
  assert.equal(updateResponse.status, 200);
  assert.equal(harness.application.status, "shortlisted");
  assert.equal(harness.histories.length, 1);
  assert.equal(harness.sessionEnded, true);

  const persistedHistory = [
    {
      application: APPLICATION_ID,
      previousStatus: "new_application",
      newStatus: "shortlisted",
      changedBy: USER_ID,
    },
  ];
  context.mock.method(
    ApplicationStatusHistory,
    "find",
    (() => {
      const query = {
        populate: () => query,
        sort: async () => persistedHistory,
      };
      return query;
    }) as unknown as typeof ApplicationStatusHistory.find
  );
  const historyResponse = await send(
    `/api/application-status-history/${APPLICATION_ID}`,
    { token: tokenFor("super_admin") }
  );
  assert.equal(historyResponse.status, 200);
  const historyData = await json(historyResponse);
  assert.equal(historyData.total, 1);
  assert.equal(historyData.history[0].newStatus, "shortlisted");
  assert.equal(typeof updateApplicationStatus, "function");
});

test("status changes roll back when the status write fails", async (context) => {
  const harness = createStatusTransactionHarness(context, "update");
  const { updateApplicationStatus } = await import(
    "../src/services/application.service"
  );

  await assert.rejects(
    updateApplicationStatus(
      APPLICATION_ID,
      "shortlisted",
      USER_ID,
      { userId: USER_ID, role: "super_admin" },
      "Test"
    ),
    /status update failed/
  );
  assert.equal(harness.application.status, "new_application");
  assert.equal(harness.histories.length, 0);
  assert.equal(harness.sessionEnded, true);
});

test("status changes roll back when history creation fails", async (context) => {
  const harness = createStatusTransactionHarness(context, "history");
  const { updateApplicationStatus } = await import(
    "../src/services/application.service"
  );

  await assert.rejects(
    updateApplicationStatus(
      APPLICATION_ID,
      "shortlisted",
      USER_ID,
      { userId: USER_ID, role: "super_admin" },
      "Test"
    ),
    /history creation failed/
  );
  assert.equal(harness.application.status, "new_application");
  assert.equal(harness.histories.length, 0);
  assert.equal(harness.sessionEnded, true);
});

test("SMTP delivery failure leaves verification unusable and response generic", async (context) => {
  const candidate = {
    _id: USER_ID,
    email: "candidate@example.com",
    consent: true,
    consentAt: new Date(),
  };
  const job = { _id: JOB_ID, status: "active", isPublished: true };
  context.mock.method(
    Candidate,
    "findById",
    (() => ({
      select: async () => candidate,
      then: (
        resolve: (value: typeof candidate) => unknown,
        reject?: (reason: unknown) => unknown
      ) => Promise.resolve(candidate).then(resolve, reject),
    })) as unknown as typeof Candidate.findById
  );
  context.mock.method(
    Job,
    "findById",
    (() => ({
      select: async () => job,
      then: (
        resolve: (value: typeof job) => unknown,
        reject?: (reason: unknown) => unknown
      ) => Promise.resolve(job).then(resolve, reject),
    })) as unknown as typeof Job.findById
  );
  context.mock.method(
    Application,
    "exists",
    (async () => null) as unknown as typeof Application.exists
  );
  context.mock.method(
    ApplicationVerification,
    "findOneAndUpdate",
    (async () => null) as unknown as typeof ApplicationVerification.findOneAndUpdate
  );
  context.mock.method(
    ApplicationVerification,
    "create",
    (async () => ({ _id: OTHER_ID })) as unknown as typeof ApplicationVerification.create
  );
  let deliveryConfirmationCalls = 0;
  context.mock.method(
    ApplicationVerification,
    "updateOne",
    (async () => {
      deliveryConfirmationCalls += 1;
      return { acknowledged: true, modifiedCount: 1 };
    }) as unknown as typeof ApplicationVerification.updateOne
  );
  context.mock.method(
    nodemailer,
    "createTransport",
    (() => ({
      sendMail: async () => {
        throw new Error("SMTP credentials or host details");
      },
    })) as unknown as typeof nodemailer.createTransport
  );
  context.mock.method(console, "error", () => undefined);

  const response = await send("/api/applications/verification", {
    method: "POST",
    body: { candidateId: USER_ID, jobId: JOB_ID },
  });
  assert.equal(response.status, 202);
  assert.match((await json(response)).message, /request received/i);
  assert.equal(deliveryConfirmationCalls, 0);

  context.mock.method(
    ApplicationVerification,
    "findOneAndDelete",
    (async () => null) as unknown as typeof ApplicationVerification.findOneAndDelete
  );
  context.mock.method(
    ApplicationVerification,
    "updateOne",
    (async () => ({ acknowledged: true, modifiedCount: 1 })) as unknown as typeof ApplicationVerification.updateOne
  );
  context.mock.method(
    Application,
    "create",
    (async () => {
      throw new Error("Application creation must not be reached");
    }) as unknown as typeof Application.create
  );
  const submissionResponse = await send("/api/applications", {
    method: "POST",
    body: {
      candidateId: USER_ID,
      jobId: JOB_ID,
      verificationCode: "123456",
    },
  });
  assert.equal(submissionResponse.status, 401);
  assert.equal(
    (await json(submissionResponse)).message,
    "Unable to verify applicant email"
  );
  assert.equal(job.status, "active");
});

test("production error middleware hides unexpected internal errors", async (context) => {
  stubActiveUser(context);
  context.mock.method(
    Client,
    "find",
    (() => ({
      sort: async () => {
        throw new Error("database credentials and query details");
      },
    })) as unknown as typeof Client.find
  );

  const response = await send("/api/clients", {
    token: tokenFor("super_admin"),
  });
  assert.equal(response.status, 500);
  assert.deepEqual(await json(response), {
    success: false,
    message: "Internal server error",
  });
});
