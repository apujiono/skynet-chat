import React, { useState } from 'react';
import { encryptMessage } from '../lib/crypto';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat.railway.app';

function Dashboard({ username, token, currentChannel, setCurrentChannel, subscribedChannels, setSubscribedChannels, theme, setTheme }) {
  const [command, setCommand] = useState('');
  const [selectedGift, setSelectedGift] = useState('flower');

  const sendMessage = async () => {
    const message = prompt('Masukkan pesan:');
    if (message) {
      const encrypted = await encryptMessage(message, 'skynet-key');
      await fetch(`${SERVER_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel: currentChannel, message: encrypted, private: false })
      });
    }
  };

  const startStream = async () => {
    const title = prompt('Judul stream:');
    if (title) {
      await fetch(`${SERVER_URL}/streaming/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel: currentChannel, title, is_private: false })
      });
      window.location.href = '/stream';
    }
  };

  const sendGift = async () => {
    const amount = prompt('Masukkan jumlah ($):');
    if (amount) {
      const response = await fetch(`${SERVER_URL}/streaming/gift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gift_type: selectedGift, diamond_cost: parseInt(amount), channel: currentChannel })
      });
      const data = await response.json();
      const stripe = window.Stripe('pk_test_...'); // Ganti dengan public key
      stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: { token: 'tok_visa' } }
      }).then((result) => {
        alert(result.error ? '❌ Gagal' : `✅ Gift ${selectedGift} ($ ${amount}) terkirim!`);
      });
    }
  };

  const sendEmergency = async () => {
    const message = prompt('Masukkan pesan darurat:');
    if (message) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        await fetch(`${SERVER_URL}/emergency/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ channel: currentChannel, message, location })
        });
      });
    }
  };

  const handleCommand = async (e) => {
    if (e.key === 'Enter') {
      const cmd = command.trim();
      setCommand('');
      if (cmd.startsWith('/msg')) {
        const parts = cmd.split(' ').slice(1);
        const channel = parts[0] || currentChannel;
        const message = parts.slice(1).join(' ');
        const encrypted = await encryptMessage(message, 'skynet-key');
        await fetch(`${SERVER_URL}/chat/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ channel, message: encrypted, private: false })
        });
      } else if (cmd.startsWith('/sawer')) {
        const parts = cmd.split(' ').slice(1);
        const amount = parts[0];
        const request = parts.slice(1).join(' ');
        await fetch(`${SERVER_URL}/chat/donation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ amount: parseInt(amount), message: request, channel: currentChannel })
        });
      } else if (cmd.startsWith('/emergency')) {
        sendEmergency();
      } else {
        alert('❌ Perintah tidak valid! Gunakan /help.');
      }
    }
  };

  const friendOptions = [
    { value: 'follow', label: 'Follow Teman' },
    { value: 'unfollow', label: 'Unfollow Teman' },
    { value: 'list', label: 'Lihat Daftar Teman' }
  ];

  const handleFriendAction = (option) => {
    if (option === 'list') window.location.href = '/friends';
    else alert(`Coming soon: ${option}`);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-xl text-white mb-4">🌌 SkyNet Dashboard | Channel: {currentChannel} | Tema: {theme}</h2>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">💬 Kirim Pesan</button>
        <button onClick={() => window.location.href = '/chat'} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">📜 Lihat Pesan</button>
        <button onClick={startStream} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">📹 Mulai Live</button>
        <button onClick={sendGift} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">💰 Kirim Gift</button>
        <button onClick={sendEmergency} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">🚨 Pesan Darurat</button>
        <Dropdown options={friendOptions} onChange={(e) => handleFriendAction(e.value)} placeholder="Kelola Teman 👥" className="bg-purple-500 text-white px-4 py-2 rounded" />
        <button onClick={() => window.location.href = '/profile'} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">🖼️ Edit Profil</button>
        <button onClick={() => window.location.href = '/paywall'} className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">🔒 Lihat Konten Berbayar</button>
        <button onClick={() => window.location.href = '/analytics'} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">📈 Analytics</button>
        <button onClick={() => window.location.href = '/polls'} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">📊 Buat Polling</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">🌈 Ganti Tema</button>
        <button onClick={() => window.location.href = '/'} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">🚪 Logout</button>
        <select
          value={currentChannel}
          onChange={(e) => setCurrentChannel(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          {subscribedChannels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
        </select>
        <select
          value={selectedGift}
          onChange={(e) => setSelectedGift(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option value="flower">Bunga ($5)</option>
          <option value="rocket">Roket ($10)</option>
          <option value="star">Bintang ($20)</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Ketik /msg, /sawer, /emergency, dll."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyPress={handleCommand}
        className="w-full p-2 bg-gray-700 text-white rounded"
      />
    </div>
  );
}

export default Dashboard;
