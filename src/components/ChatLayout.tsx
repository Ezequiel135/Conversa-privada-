import { useState } from 'react';
import { motion } from 'motion/react';
import { Chat } from './Chat';

export function ChatLayout({ room }: { room: string }) {
  return (
    <div className="flex h-screen bg-stone-50 dark:bg-stone-950">
      {/* Left Panel */}
      <motion.div 
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-stone-200 dark:border-stone-800 p-4 hidden md:block"
      >
        <h2 className="text-xl font-display font-bold text-stone-900 dark:text-stone-100">Room: {room}</h2>
        <div className="mt-4 text-stone-500">Users (1)</div>
      </motion.div>

      {/* Center Panel */}
      <div className="flex-1 flex flex-col">
        <Chat room={room} />
      </div>

      {/* Right Panel */}
      <motion.div 
        initial={{ x: 200 }}
        animate={{ x: 0 }}
        className="w-64 border-l border-stone-200 dark:border-stone-800 p-4 hidden lg:block"
      >
        <h2 className="text-xl font-display font-bold text-stone-900 dark:text-stone-100">Controls</h2>
      </motion.div>
    </div>
  );
}
