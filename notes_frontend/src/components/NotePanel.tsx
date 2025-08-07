"use client";
import { useState, useEffect } from "react";
import {
  Note,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
} from "../app/api/notes";

type NotePanelProps = {
  activeId: string | null;
  reloadNotes: () => void;
  onSelect: (id: string | null) => void;
};

export default function NotePanel({
  activeId,
  reloadNotes,
  onSelect,
}: NotePanelProps) {
  const isCreating = activeId === null;
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<"view" | "edit" | "create">("view");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (isCreating) {
      setNote(null);
      setTitle("");
      setContent("");
      setMode("create");
      setMsg(null);
      return;
    }
    if (activeId) {
      setLoading(true);
      fetchNote(activeId)
        .then((n) => {
          if (!ignore) {
            setNote(n);
            setTitle(n.title);
            setContent(n.content);
            setMode("view");
            setMsg(null);
          }
        })
        .catch(() => {
          if (!ignore) setMsg("Failed to load note");
        })
        .finally(() => setLoading(false));
    }
    return () => {
      ignore = true;
    };
  }, [activeId, isCreating]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isCreating) {
        const newNote = await createNote({ title, content });
        onSelect(newNote.id);
      } else if (note) {
        await updateNote(note.id, { title, content });
        setMode("view");
        reloadNotes();
        setMsg("Saved.");
      }
      reloadNotes();
    } catch {
      setMsg("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    setLoading(true);
    try {
      await deleteNote(note.id);
      reloadNotes();
      onSelect(null);
      setMsg("Deleted.");
    } catch {
      setMsg("Failed to delete note");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-400">Loading...</div>;

  if (mode === "create" || mode === "edit" || isCreating) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h2 className="font-semibold text-2xl mb-4 text-primary">
          {isCreating ? "New Note" : "Edit Note"}
        </h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full px-3 py-2 border border-gray-300 rounded text-lg focus:outline-accent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
          <textarea
            placeholder="Your note..."
            className="w-full px-3 py-2 border border-gray-300 rounded min-h-[160px] focus:outline-accent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={2048}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded hover:bg-accent"
              disabled={loading}
            >
              Save
            </button>
            {!isCreating && (
              <button
                type="button"
                className="border border-gray-300 px-6 py-2 rounded"
                onClick={() => setMode("view")}
              >
                Cancel
              </button>
            )}
          </div>
          {msg && (
            <div className="text-sm text-center text-gray-500 mt-2">{msg}</div>
          )}
        </form>
      </div>
    );
  }

  if (!note)
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select or create a note
      </div>
    );

  // View mode
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-2xl text-primary">
          {note.title || "Untitled"}
        </h2>
        <div className="space-x-1">
          <button
            className="px-2 py-1 rounded text-accent hover:underline text-sm"
            onClick={() => setMode("edit")}
          >
            Edit
          </button>
          <button
            className="px-2 py-1 rounded text-red-500 hover:underline text-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-gray-500 mb-4 text-[12px]">
        <span>
          Created: {new Date(note.createdAt).toLocaleString()}
        </span>{" "}
        |{" "}
        <span>
          Updated: {new Date(note.updatedAt).toLocaleString()}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-lg text-secondary min-h-[120px] mb-2">
        {note.content}
      </p>
      {msg && (
        <div className="text-sm text-center text-gray-500 mt-2">{msg}</div>
      )}
    </div>
  );
}
