import React, { useState } from 'react';
import { useWebRTC } from '../lib/webrtc';

function LiveStream({ username, token, currentChannel }) {
  const { startStream, joinStream } = useWebRTC();
  const [giftType, setGiftType] = useState('flower');
  const [giftAmount, setGiftAmount] = useState(5);

  const handleStartStream = async () => {
    const title = prompt('Judul stream:');
    const useAvatar = confirm('Gunakan 3D avatar?');
    if (title) {
      await fetch(`${SERVER_URL}/streaming/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channel: currentChannel, title, is_private: false })
      });
      startStream(currentChannel, useAvatar ? 'https://readyplayer.me/avatar' : null);
    }
  };

  const handleSendGift = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/streaming/gift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gift_type: giftType, diamond_cost: parseInt(giftAmount), channel: currentChannel })
      });
      const data = await response.json();
      const stripe = window.Stripe('pk_test_...'); // Ganti dengan public key
      stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: { token: 'tok_visa' } }
      }).then((result) => {
        alert(result.error ? '❌ Gagal' : `✅ Gift ${giftType} ($ ${giftAmount}) terkirim!`);
      });
    } catch (error) {
      alert('❌ Gagal memproses gift!');
    }
  };

  return (
    <div className="live-section p-4 bg-gray-900 text-white">
      <h2 className="text-2xl">Live Streaming di {currentChannel} 📹</h2>
      <button onClick={handleStartStream} className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">Mulai Stream</button>
      <div className="gift-section mt-4">
        <select value={giftType} onChange={(e) => setGiftType(e.target.value)} className="text-black">
          <option value="flower">Bunga ($5)</option>
          <option value="rocket">Roket ($10)</option>
          <option value="star">Bintang ($20)</option>
        </select>
        <input type="number" value={giftAmount} onChange={(e) => setGiftAmount(e.target.value)} className="text-black" />
        <button onClick={handleSendGift} className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">Kirim Gift 💰</button>
      </div>
      <div className="video-feed mt-4">
        <video id="stream" autoPlay className="w-full h-64 bg-black"></video>
      </div>
    </div>
  );
}

export default LiveStream;
