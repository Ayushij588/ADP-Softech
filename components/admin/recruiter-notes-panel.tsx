"use client";

import { useId, useState } from "react";

export type RecruiterNote = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  tags: string[];
};

export function RecruiterNotesPanel({
  initialNotes,
  description,
}: {
  initialNotes: readonly RecruiterNote[];
  description: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");
  const [tags, setTags] = useState("");
  const [feedback, setFeedback] = useState("");
  const noteId = useId();
  const tagsId = useId();

  function addNote() {
    const text = draft.trim();
    if (!text) return;

    setNotes((current) => [
      {
        id: `local-${Date.now()}`,
        text,
        author: "Demo Recruiter",
        createdAt: new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
        tags: [...new Set(tags.split(",").map((tag) => tag.trim()).filter(Boolean))],
      },
      ...current,
    ]);
    setDraft("");
    setTags("");
    setFeedback("Note added to this local demo view.");
  }

  return (
    <section
      aria-labelledby="recruiter-notes-heading"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-semibold text-slate-950" id="recruiter-notes-heading">
        Recruiter Notes
      </h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.65fr)]">
        <label className="block text-sm font-medium text-slate-700" htmlFor={noteId}>
          Add a note
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            id={noteId}
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder="Add screening observations or follow-up..."
            value={draft}
          />
        </label>
        <div className="flex flex-col justify-between gap-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor={tagsId}>
            Tags
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              id={tagsId}
              onChange={(event) => setTags(event.currentTarget.value)}
              placeholder="Follow-up, Technical"
              value={tags}
            />
          </label>
          <button
            className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
            disabled={!draft.trim()}
            onClick={addNote}
            type="button"
          >
            Add note
          </button>
        </div>
      </div>

      {feedback && (
        <p aria-live="polite" className="mt-3 text-sm text-emerald-800" role="status">
          {feedback}
        </p>
      )}

      <ol aria-label="Recruiter note history" className="mt-5 space-y-3">
        {notes.map((note) => (
          <li className="rounded-xl border border-slate-100 bg-slate-50/70 p-4" key={note.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{note.author}</p>
              <time className="text-xs text-slate-500">{note.createdAt}</time>
            </div>
            <p className="mt-2 break-words text-sm leading-6 text-slate-700">{note.text}</p>
            {note.tags.length > 0 && (
              <ul aria-label="Note tags" className="mt-3 flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <li
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800"
                    key={tag}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
