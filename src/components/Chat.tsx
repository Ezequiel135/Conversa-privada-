import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { encryptionService } from '../services/encryptionService';
import { TypingIndicator } from './TypingIndicator';
import { ReactionPicker } from './ReactionPicker';
import { MessageBubble } from './MessageBubble';

const socket = io();

export function Chat({ room }: { room: string }) {
  const [messages, setMessages] = useState<{ id: number; text: string; reactions: string[]; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);

  // Generate key once when room changes
  useEffect(() => {
    encryptionService.generateKey(room).then(setKey);
  }, [room]);

  // Set up socket listeners once
  useEffect(() => {
    if (!key) return;

    socket.emit('join-room', room);
    
    const handleMessage = async (data: any) => {
      const text = await encryptionService.decrypt(data.ciphertext, data.iv, key);
      setMessages((prev) => [...prev, { id: data.id, text, reactions: [], sender: data.sender }]);
    };
    
    const handleTypingStart = (data: any) => setTypingUsers(prev => [...new Set([...prev, data.userId])]);
    const handleTypingStop = (data: any) => setTypingUsers(prev => prev.filter(u => u !== data.userId));
    const handleReaction = (data: any) => {
      setMessages(prev => prev.map(m => m.id === data.messageId ? { ...m, reactions: [...m.reactions, data.emoji] } : m));
    };

    socket.on('chat-message', handleMessage);
    socket.on('typing-start', handleTypingStart);
    socket.on('typing-stop', handleTypingStop);
    socket.on('message-reaction', handleReaction);

    return () => {
      socket.off('chat-message', handleMessage);
      socket.off('typing-start', handleTypingStart);
      socket.off('typing-stop', handleTypingStop);
      socket.off('message-reaction', handleReaction);
    };
  }, [room, key]);

  const sendMessage = useCallback(async () => {
    if (!key) return;
    const { ciphertext, iv } = await encryptionService.encrypt(input, key);
    socket.emit('chat-message', { room, ciphertext, iv, id: Date.now(), sender: socket.id });
    setInput('');
    socket.emit('typing-stop', room);
  }, [input, key, room]);

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 0) socket.emit('typing-start', room);
    else socket.emit('typing-stop', room);
  }, [room]);

  const addReaction = useCallback((messageId: number, emoji: string) => {
    socket.emit('message-reaction', { room, messageId, emoji });
    setReactionTarget(null);
  }, [room]);

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* WhatsApp Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none dark:opacity-[0.03]" 
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
      />
      
      <div className="flex-1 p-4 overflow-y-auto z-10">
        {messages.map((msg) => (
          <div key={msg.id} onContextMenu={(e) => { e.preventDefault(); setReactionTarget(msg.id); }} className="relative">
            <MessageBubble message={msg} isOwn={msg.sender === socket.id} />
            {reactionTarget === msg.id && (
              <div className="absolute top-0 left-0 z-50">
                <ReactionPicker onSelect={(e) => addReaction(msg.id, e)} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-2 bg-[#f0f2f5] dark:bg-[#1e2428] z-10">
        <TypingIndicator users={typingUsers} />
        <div className="flex gap-2 items-center">
          <div className="flex-1 bg-white dark:bg-[#2a2f32] rounded-full px-4 py-2 flex items-center shadow-sm">
            <input 
              value={input} 
              onChange={handleTyping} 
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent outline-none text-[15px] dark:text-stone-100"
              placeholder="Type a message"
            />
          </div>
          <button 
            onClick={sendMessage} 
            className="bg-[#00a884] text-white p-3 rounded-full flex items-center justify-center shadow-md hover:bg-[#008f6f] transition-colors"
          >
            <Plus size={24} className={input.length > 0 ? 'rotate-45 transition-transform' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
