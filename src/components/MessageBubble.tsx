export function MessageBubble({ message, isOwn }: { message: { text: string; sender: string; reactions: string[] }, isOwn: boolean }) {
  return (
    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} mb-2`}>
      <div className={`relative max-w-[85%] p-2 px-3 rounded-lg shadow-sm ${
        isOwn 
          ? 'bg-[#DCF8C6] dark:bg-[#056162] text-stone-900 dark:text-stone-100 rounded-tr-none' 
          : 'bg-white dark:bg-[#262d31] text-stone-900 dark:text-stone-100 rounded-tl-none'
      }`}>
        {!isOwn && <span className="text-[11px] font-bold text-emerald-600 block mb-1">{message.sender}</span>}
        <div className="flex items-end gap-2">
          <span className="text-[14.2px] leading-tight">{message.text}</span>
          <span className="text-[10px] opacity-60 whitespace-nowrap mb-[-2px]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {message.reactions.length > 0 && (
          <div className="absolute -bottom-3 right-0 flex gap-1 bg-white dark:bg-stone-800 rounded-full px-1 shadow-sm border border-stone-100 dark:border-stone-700">
            {message.reactions.map((r, i) => <span key={i} className="text-xs">{r}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
