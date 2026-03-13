import { useState } from 'react';
import { motion } from 'motion/react';

export function Home({ onRoomJoined }: { onRoomJoined: (room: string) => void }) {
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoom = Math.random().toString(36).substring(2, 10);
    onRoomJoined(newRoom);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-stone-50 dark:bg-stone-950"
    >
      <div className="w-full max-w-md p-8 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800">
        <h1 className="text-4xl font-display font-bold text-center mb-8 text-stone-900 dark:text-stone-100">TempChat</h1>
        
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <button 
            onClick={() => onRoomJoined(roomId)}
            className="w-full p-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Join Room
          </button>
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-stone-300 dark:border-stone-700"></div>
            <span className="flex-shrink mx-4 text-stone-500">or</span>
            <div className="flex-grow border-t border-stone-300 dark:border-stone-700"></div>
          </div>
          <button 
            onClick={createRoom}
            className="w-full p-3 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Create New Room
          </button>
        </div>
      </div>
    </motion.div>
  );
}
