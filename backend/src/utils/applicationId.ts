
import Application from "../models/Application";

export const generateApplicationId = async (): Promise<string> => {
  const today = new Date();

  const datePart = today
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const prefix = `ADP-APP-${datePart}`;

  const lastApplication = await Application.findOne({
    applicationId: { $regex: `^${prefix}` },
  }).sort({ applicationId: -1 });

  let nextNumber = 1;

  if (lastApplication) {
    const lastNumber = parseInt(
      lastApplication.applicationId.split("-").pop() || "0"
    );

    nextNumber = lastNumber + 1;
  }

  return `${prefix}-${String(nextNumber).padStart(4, "0")}`;
};
