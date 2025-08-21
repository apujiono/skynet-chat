import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ChatBox from './components/ChatBox';
import LiveStream from './components/LiveStream';
import FriendsList from './components/FriendsList';
import Profile from './components/Profile';
import PaywallMedia from './components/PaywallMedia';
import Analytics from './components/Analytics';
import Polls from './components/Polls';

function App() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [currentChannel, setCurrentChannel] = useState('general');
  const [subscribedChannels, setSubscribedChannels] = useState(['general']);
  const [theme, setTheme] = useState('dark');

  return (
    <Router>
      <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
        <Routes>
          <Route path="/" element={<Auth setUsername={setUsername} setToken={setToken} />} />
          <Route path="/dashboard" element={
            <Dashboard
              username={username}
              token={token}
              currentChannel={currentChannel}
              setCurrentChannel={setCurrentChannel}
              subscribedChannels={subscribedChannels}
              setSubscribedChannels={setSubscribedChannels}
              theme={theme}
              setTheme={setTheme}
            />
          } />
          <Route path="/chat" element={<ChatBox username={username} token={token} currentChannel={currentChannel} />} />
          <Route path="/stream" element={<LiveStream username={username} token={token} currentChannel={currentChannel} />} />
          <Route path="/friends" element={<FriendsList username={username} token={token} />} />
          <Route path="/profile" element={<Profile username={username} token={token} />} />
          <Route path="/paywall" element={<PaywallMedia username={username} token={token} />} />
          <Route path="/analytics" element={<Analytics username={username} token={token} />} />
          <Route path="/polls" element={<Polls username={username} token={token} currentChannel={currentChannel} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
