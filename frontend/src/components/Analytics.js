import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat.railway.app';

function Analytics({ username, token }) {
  const [stats, setStats] = useState({ messages_sent: 0, gifts_received: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const response = await axios.get(`${SERVER_URL}/analytics/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    };
    fetchStats();
  }, [token]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl mb-4">Analytics: {username}</h2>
      <p>Pesan Terkirim: {stats.messages_sent}</p>
      <p>Gift Diterima: {stats.gifts_received}</p>
    </div>
  );
}

export default Analytics;
