export function useWebRTC() {
  const startStream = async (channel, avatarUrl = null) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    console.log(`Streaming ke channel ${channel}${avatarUrl ? ' dengan avatar' : ''}`);
    return peerConnection;
  };

  const joinStream = async (channel) => {
    const peerConnection = new RTCPeerConnection();
    peerConnection.ontrack = (event) => {
      const video = document.getElementById('stream');
      video.srcObject = event.streams[0];
    };
    console.log(`Bergabung ke stream di ${channel}`);
    return peerConnection;
  };

  return { startStream, joinStream };
}
