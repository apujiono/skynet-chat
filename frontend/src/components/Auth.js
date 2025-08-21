import React, { useState } from 'react';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat.railway.app';

function Auth({ setUsername, setToken }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const handleSubmit = async () => {
    try {
      const endpoint = isRegister ? '/users/register' : '/users/login';
      const response = await axios.post(`${SERVER_URL}${endpoint}`, { username, password });
      setUsername(username);
      setToken(response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.detail || 'Unknown error');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 rounded-lg">
      <h2 className="text-2xl mb-4">{isRegister ? 'Register' : 'Login'} Anonymously</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setLocalUsername(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        {isRegister ? 'Register' : 'Login'}
      </button>
      <button onClick={() => setIsRegister(!isRegister)} className="text-blue-400 ml-4">
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
    </div>
  );
}

export default Auth;
