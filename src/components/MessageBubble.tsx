export function MessageBubble({ message, isOwn }: { message: { text: string; sender: string; reactions: string[] }, isOwn: boolean }) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-4`}>
      <span className="text-xs text-stone-500 mb-1">{message.sender}</span>
      <div className={`p-3 rounded-2xl ${isOwn ? 'bg-emerald-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'}`}>
        {message.text}
        {message.reactions.length > 0 && <span className="ml-2">{message.reactions.join(' ')}</span>}
      </div>
      <span className="text-xs text-stone-400 mt-1">{new Date().toLocaleTimeString()}</span>
    </div>
  );
}
