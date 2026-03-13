import { motion } from 'motion/react';
import { ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { Chat } from './Chat';

export function ChatLayout({ room, onBack }: { room: string; onBack: () => void }) {
  return (
    <div className="flex h-screen bg-[#ECE5DD] dark:bg-stone-950">
      {/* Center Panel */}
      <div className="flex-1 flex flex-col h-full">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
              <span className="text-[#075E54] font-bold">{room[0].toUpperCase()}</span>
            </div>
            <div>
              <h2 className="font-semibold leading-tight">{room}</h2>
              <span className="text-xs opacity-80">online</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Video size={20} />
            <Phone size={20} />
            <MoreVertical size={20} />
          </div>
        </div>

        <Chat room={room} />
      </div>
    </div>
  );
}
