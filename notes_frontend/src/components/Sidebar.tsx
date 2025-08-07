"use client";

import { Note } from "../app/api/notes";

type SidebarProps = {
  notes: Note[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  search: string;
  setSearch: (s: string) => void;
};

export default function Sidebar({ notes, activeId, onSelect, search, setSearch }: SidebarProps) {
  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col p-3">
      <header className="mb-2">
        <h1 className="text-lg font-semibold text-primary">Notes</h1>
      </header>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search notes"
          className="w-full px-2 py-1 rounded border border-gray-300 focus:outline-accent text-base"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {notes.length === 0 && <li className="text-gray-400 text-sm text-center mt-6">No notes</li>}
          {notes.map(note => (
            <li
              key={note.id}
              className={`rounded px-2 py-1 cursor-pointer 
                ${
                  activeId === note.id
                    ? "bg-accent text-white font-semibold"
                    : "hover:bg-gray-100"
                }`}
              onClick={() => onSelect(note.id)}
            >
              <span className="truncate block">{note.title || "Untitled"}</span>
            </li>
          ))}
        </ul>
      </nav>
      <button
        onClick={() => onSelect(null)}
        className="mt-4 bg-primary text-white text-sm py-2 rounded hover:bg-accent transition"
      >
        + New Note
      </button>
    </aside>
  );
}
