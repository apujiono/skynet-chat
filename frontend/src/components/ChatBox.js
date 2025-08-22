useEffect(() => {
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/chat/messages?channel=${currentChannel}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.map(msg => ({ ...msg, message: decryptMessage(msg.message, 'skynet-key') })));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  fetchMessages();
  const interval = setInterval(fetchMessages, 5000);
  return () => clearInterval(interval);
}, [currentChannel, token]);
