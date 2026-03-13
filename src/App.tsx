/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home } from './components/Home';
import { ChatLayout } from './components/ChatLayout';

export default function App() {
  const [room, setRoom] = useState<string | null>(null);

  if (!room) {
    return <Home onRoomJoined={setRoom} />;
  }

  return <ChatLayout room={room} />;
}
