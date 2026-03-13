import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Users, UserPlus, MoreVertical, Search, Plus } from 'lucide-react';
import { ChatRoom, Contact } from '../types';

export function WhatsAppHome({ onChatSelect }: { onChatSelect: (roomId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
  const [chats, setChats] = useState<ChatRoom[]>([
    { id: 'general', name: 'General Group', isGroup: true, participants: [], lastMessage: 'Welcome to TempChat!', lastMessageTime: '10:30 AM' }
  ]);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Alice', lastMessage: 'Hey there!', lastMessageTime: 'Yesterday' }
  ]);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateContact = () => {
    if (!newContactName) return;
    const newContact: Contact = {
      id: Math.random().toString(36).substring(2, 9),
      name: newContactName,
    };
    setContacts([...contacts, newContact]);
    setNewContactName('');
    setIsCreatingContact(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName) return;
    const newGroup: ChatRoom = {
      id: Math.random().toString(36).substring(2, 9),
      name: newGroupName,
      isGroup: true,
      participants: [],
    };
    setChats([...chats, newGroup]);
    setNewGroupName('');
    setIsCreatingGroup(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-stone-950">
      {/* Header */}
      <div className="bg-[#075E54] text-white p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">WhatsApp Private</h1>
          <div className="flex gap-4">
            <Search size={20} />
            <MoreVertical size={20} />
          </div>
        </div>
        <div className="flex justify-around text-sm font-bold uppercase tracking-wider">
          <button 
            onClick={() => setActiveTab('chats')}
            className={`pb-2 px-4 transition-all ${activeTab === 'chats' ? 'border-b-4 border-white' : 'opacity-70'}`}
          >
            Chats
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`pb-2 px-4 transition-all ${activeTab === 'contacts' ? 'border-b-4 border-white' : 'opacity-70'}`}
          >
            Contacts
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'chats' ? (
            <motion.div 
              key="chats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="divide-y divide-stone-100 dark:divide-stone-800"
            >
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => onChatSelect(chat.id)}
                  className="flex items-center p-4 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4">
                    {chat.isGroup ? <Users size={24} className="text-stone-500" /> : <MessageSquare size={24} className="text-stone-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100">{chat.name}</h3>
                      <span className="text-xs text-stone-500">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-stone-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="divide-y divide-stone-100 dark:divide-stone-800"
            >
              {contacts.map(contact => (
                <div 
                  key={contact.id} 
                  onClick={() => onChatSelect(contact.id)}
                  className="flex items-center p-4 hover:bg-stone-50 dark:hover:bg-stone-900 cursor-pointer transition-colors"
                >
                  <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mr-4">
                    <UserPlus size={24} className="text-stone-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100">{contact.name}</h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 items-end">
        <AnimatePresence>
          {isCreatingContact && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-64"
            >
              <h4 className="font-bold mb-2">New Contact</h4>
              <input 
                autoFocus
                type="text" 
                placeholder="Name" 
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 dark:bg-stone-800 dark:border-stone-700"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsCreatingContact(false)} className="text-stone-500 px-2 py-1">Cancel</button>
                <button onClick={handleCreateContact} className="bg-[#25D366] text-white px-4 py-1 rounded-lg font-bold">Add</button>
              </div>
            </motion.div>
          )}

          {isCreatingGroup && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-64"
            >
              <h4 className="font-bold mb-2">New Group</h4>
              <input 
                autoFocus
                type="text" 
                placeholder="Group Name" 
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 dark:bg-stone-800 dark:border-stone-700"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsCreatingGroup(false)} className="text-stone-500 px-2 py-1">Cancel</button>
                <button onClick={handleCreateGroup} className="bg-[#25D366] text-white px-4 py-1 rounded-lg font-bold">Create</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsCreatingGroup(!isCreatingGroup)}
            className="bg-stone-200 dark:bg-stone-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            title="New Group"
          >
            <Users size={24} className="text-[#075E54]" />
          </button>
          <button 
            onClick={() => setIsCreatingContact(!isCreatingContact)}
            className="bg-[#25D366] p-4 rounded-full shadow-lg text-white hover:scale-110 transition-transform"
            title="New Chat"
          >
            <Plus size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
