import React, { useState } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat.railway.app';

function Profile({ username, token }) {
  const [status, setStatus] = useState('Online');

  const updateProfile = async () => {
    await fetch(`${SERVER_URL}/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    alert('Profile updated!');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl mb-4">Edit Profil: {username}</h2>
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      <button onClick={updateProfile} className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">Simpan</button>
    </div>
  );
}

export default Profile;
