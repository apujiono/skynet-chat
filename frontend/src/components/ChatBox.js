
import React, { useEffect, useState } from 'react';
import { decryptMessage } from '../lib/crypto';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat-backend.your-username.repl.co';

function ChatBox({ username, token, currentChannel }) {
  const [messages, setMessages] = useState([]);

  // Fallback polling karena WebSocket tidak konsisten di Replit
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/chat/messages?channel=${currentChannel}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const decryptedMessages = response.data.map(msg => ({
          ...msg,
          message: decryptMessage(msg.message, 'skynet-key')
        }));
        setMessages(decryptedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll setiap 5 detik
    return () => clearInterval(interval);
  }, [currentChannel, token]);

  // Coba WebSocket, tapi nonaktifkan jika tidak berfungsi
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(`ws://skynet-chat-backend.your-username.repl.co?channel=${currentChannel}&username=${username}`);
      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const decrypted = await decryptMessage(data.message, 'skynet-key');
          setMessages(prev => [...prev, { ...data, message: decrypted }]);
        }
      };
      ws.onerror = () => console.log('WebSocket tidak didukung, menggunakan polling');
    } catch (error) {
      console.log('WebSocket gagal, menggunakan polling');
    }
    return () => ws?.close();
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
