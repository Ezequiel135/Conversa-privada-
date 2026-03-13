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
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} onContextMenu={(e) => { e.preventDefault(); setReactionTarget(msg.id); }} className="relative">
            <MessageBubble message={msg} isOwn={msg.sender === socket.id} />
            {reactionTarget === msg.id && <ReactionPicker onSelect={(e) => addReaction(msg.id, e)} />}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <TypingIndicator users={typingUsers} />
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={handleTyping} 
            className="flex-1 p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 outline-none"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all">Send</button>
        </div>
      </div>
    </div>
  );
}
