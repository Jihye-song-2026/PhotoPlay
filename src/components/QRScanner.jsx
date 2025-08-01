import React, { useState, useEffect } from 'react';
import { Play, Pause, ExternalLink, Volume2 } from 'lucide-react';

const QRScanner = ({ qrData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (qrData && qrData.type === 'voice') {
      // Create audio element for voice playback
      const audioElement = new Audio(qrData.content);
      audioElement.onended = () => setIsPlaying(false);
      audioElement.onerror = () => setError('Failed to load audio file');
      setAudio(audioElement);
    }
  }, [qrData]);

  const handleVoicePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio');
        });
        setIsPlaying(true);
      }
    }
  };

  const handleLinkOpen = () => {
    if (qrData && qrData.type === 'link') {
      window.open(qrData.content, '_blank');
    }
  };

  if (!qrData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>QR Code Content</h3>
        <p>No content found in this QR code.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {qrData.type === 'voice' ? 'Voice Message' : 'Link'}
      </h3>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}

      {qrData.type === 'voice' ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '30px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <Volume2 size={48} color="#667eea" style={{ marginBottom: '15px' }} />
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Voice message from Photo Play
            </p>
            <button
              onClick={handleVoicePlay}
              style={{
                background: isPlaying ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Play'} Voice Message
            </button>
          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <p>Recorded on: {new Date(qrData.timestamp).toLocaleDateString()}</p>
            <p>App: {qrData.app}</p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: '#f8f9fa', 
            padding: '30px', 
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <ExternalLink size={48} color="#667eea" style={{ marginBottom: '15px' }} />
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Link from Photo Play
            </p>
            <button
              onClick={handleLinkOpen}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <ExternalLink size={20} />
              Open Link
            </button>
          </div>
          
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <p>Link: {qrData.content}</p>
            <p>Created on: {new Date(qrData.timestamp).toLocaleDateString()}</p>
            <p>App: {qrData.app}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner; 