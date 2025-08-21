import React, { useEffect, useState } from 'react';
import { decryptMessage } from '../lib/crypto';

function ChatBox({ username, token, currentChannel }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://skynet-chat.railway.app?channel=${currentChannel}&username=${username}`);
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const decrypted = await decryptMessage(data.message, 'skynet-key');
        setMessages(prev => [...prev, { ...data, message: decrypted }]);
      }
    };
    return () => ws.close();
  }, [currentChannel, username]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl mb-4">Chat: {currentChannel}</h2>
      <div className="h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.priority ? 'text-red-400' : 'text-white'}>
            {msg.username}: {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatBox;
