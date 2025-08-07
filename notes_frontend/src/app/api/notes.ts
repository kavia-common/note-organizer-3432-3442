"use server";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};

// PUBLIC_INTERFACE
export async function fetchNotes(query?: string): Promise<Note[]> {
  /**Fetch all notes, with optional search*/
  let url = process.env.NEXT_PUBLIC_NOTES_API_URL || "http://localhost:4000/notes";
  if (query) url += `?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

// PUBLIC_INTERFACE
export async function fetchNote(id: string): Promise<Note> {
  /**Fetch note by ID*/
  const url = `${process.env.NEXT_PUBLIC_NOTES_API_URL || "http://localhost:4000/notes"}/${id}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch note");
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(note: { title: string; content: string }): Promise<Note> {
  /**Create a new note*/
  const res = await fetch(process.env.NEXT_PUBLIC_NOTES_API_URL || "http://localhost:4000/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Failed to create note");
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, note: { title: string; content: string }): Promise<Note> {
  /**Update an existing note*/
  const url = `${process.env.NEXT_PUBLIC_NOTES_API_URL || "http://localhost:4000/notes"}/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to update note");
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  /**Delete an existing note*/
  const url = `${process.env.NEXT_PUBLIC_NOTES_API_URL || "http://localhost:4000/notes"}/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete note");
}
