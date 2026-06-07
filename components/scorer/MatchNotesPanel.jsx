export default function MatchNotesPanel({ notes }) {
  if (!notes?.length) return null;

  return (
    <div className="bg-[#101D35] rounded-3xl p-6">
      <h2 className="text-2xl font-black mb-4">Match Notes</h2>
      <div className="space-y-3">
        {notes.slice(-5).reverse().map((note) => (
          <p key={note.createdAt} className="text-slate-300">
            <span className="font-bold text-[var(--vs-gold)]">{note.role}:</span>{" "}
            {note.text}
          </p>
        ))}
      </div>
    </div>
  );
}
