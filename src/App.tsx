/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppHome } from './components/WhatsAppHome';
import { ChatLayout } from './components/ChatLayout';

export default function App() {
  const [room, setRoom] = useState<string | null>(null);

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-stone-950">
      <AnimatePresence mode="wait">
        {!room ? (
          <motion.div
            key="home"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full w-full"
          >
            <WhatsAppHome onChatSelect={setRoom} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full w-full"
          >
            <ChatLayout room={room} onBack={() => setRoom(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
