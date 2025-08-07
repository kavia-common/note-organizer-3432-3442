"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import NotePanel from "../components/NotePanel";
import { Note, fetchNotes } from "@/app/api/notes";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  const loadNotes = useCallback(async () => {
    const data = await fetchNotes(search);
    setNotes(data);
    // Preserve selected note if still exists, otherwise select first
    setActiveId((cur) => (data.find((n) => n.id === cur) ? cur : data[0]?.id || null));
  }, [search]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  return (
    <main className="min-h-screen flex font-sans">
      <Sidebar
        notes={notes}
        activeId={activeId}
        onSelect={setActiveId}
        search={search}
        setSearch={setSearch}
      />
      <section className="flex-1 h-screen overflow-auto bg-white border-l border-gray-200">
        <NotePanel
          activeId={activeId}
          reloadNotes={loadNotes}
          onSelect={setActiveId}
        />
      </section>
    </main>
  );
}
