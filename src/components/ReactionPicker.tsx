export function ReactionPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
  return (
    <div className="flex gap-2 p-2 border bg-white shadow-lg rounded">
      {emojis.map(e => <button key={e} onClick={() => onSelect(e)}>{e}</button>)}
    </div>
  );
}
