export function TypingIndicator({ users }: { users: string[] }) {
  if (users.length === 0) return null;
  return <div className="text-xs text-gray-500 italic">{users.join(', ')} {users.length === 1 ? 'is' : 'are'} typing...</div>;
}
