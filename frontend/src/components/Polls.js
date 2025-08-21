import React, { useState } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://skynet-chat.railway.app';

function Polls({ username, token, currentChannel }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const createPoll = async () => {
    await fetch(`${SERVER_URL}/polls/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ channel: currentChannel, question, options })
    });
    alert('Poll created!');
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl mb-4">Buat Polling di {currentChannel}</h2>
      <input
        type="text"
        placeholder="Pertanyaan"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Opsi ${idx + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[idx] = e.target.value;
            setOptions(newOptions);
          }}
          className="w-full p-2 mb-2 bg-gray-700 text-white rounded"
        />
      ))}
      <button onClick={createPoll} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Buat Polling</button>
    </div>
  );
}

export default Polls;
