import React, { useState, useEffect } from 'react';
import { Play, Pause, ExternalLink, Volume2, ArrowLeft, Home } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PlayPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    console.log('QR Data Parameter:', dataParam);
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        console.log('Decoded QR Data:', decodedData);
        setQrData(decodedData);
        
        if (decodedData.type === 'voice') {
          console.log('Audio URL:', decodedData.content);
          
          // Fix: Handle double-encoded URLs from QR code
          let audioURL = decodedData.content;
          if (audioURL.includes('%252F')) {
            // Convert double-encoded %252F back to %2F
            audioURL = audioURL.replace(/%252F/g, '%2F');
            console.log('🔧 Converting double-encoded URL back to single encoding');
            console.log('📡 Original from QR:', decodedData.content);
            console.log('🔧 Processed URL:', audioURL);
          }
          
          console.log('Using audio URL:', audioURL);
          
          // Create audio element directly with the Firebase URL
          const audioElement = new Audio();
          
          // Add event listeners before setting the source
          audioElement.onended = () => setIsPlaying(false);
          audioElement.onerror = (e) => {
            console.error('Audio error:', e);
            console.error('Audio error details:', e.target.error);
            setError(`Failed to load audio file. URL: ${audioURL}. This might be because Firebase is not configured properly or the audio file was uploaded with old credentials.`);
          };
          audioElement.onloadstart = () => console.log('Audio loading started');
          audioElement.oncanplay = () => console.log('Audio can play');
          audioElement.oncanplaythrough = () => console.log('Audio can play through');
          audioElement.onload = () => console.log('Audio loaded successfully');
          audioElement.onabort = () => console.log('Audio loading aborted');
          audioElement.onemptied = () => console.log('Audio emptied');
          audioElement.onstalled = () => console.log('Audio stalled');
          audioElement.onsuspend = () => console.log('Audio suspended');
          
          // Set the source directly
          audioElement.src = audioURL;
          setAudio(audioElement);
          
          // Test if the audio can load
          audioElement.load();
        }
      } catch (error) {
        console.error('Error parsing QR data:', error);
        setError('Invalid QR code data');
      }
    } else {
      setError('No data found in QR code');
    }
    setLoading(false);
  }, [searchParams]);

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

  const goHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ color: 'white', marginTop: '20px' }}>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          margin: '0 auto', 
          padding: '40px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>Error</h3>
          <p style={{ color: '#666', marginBottom: '30px' }}>{error}</p>
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '10px', fontSize: '0.9rem' }}>
            <p><strong>Debug Info:</strong></p>
            <p>QR Data: {JSON.stringify(qrData, null, 2)}</p>
          </div>
          <button 
            onClick={goHome}
            style={{
              background: '#667eea',
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
            <Home size={20} />
            Go to Photo Play
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%',
        background: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <button 
            onClick={goHome}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={20} color="#667eea" />
          </button>
          <div>
            <h3 style={{ margin: 0, color: '#333' }}>Photo Play</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              {qrData?.type === 'voice' ? 'Voice Message' : 'Link'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {qrData?.type === 'voice' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '40px', 
                borderRadius: '15px',
                marginBottom: '20px'
              }}>
                <Volume2 size={64} color="#667eea" style={{ marginBottom: '20px' }} />
                <h4 style={{ marginBottom: '15px', color: '#333' }}>Voice Message</h4>
                <p style={{ marginBottom: '25px', color: '#666' }}>
                  Listen to the voice recording from Photo Play
                </p>
                <button
                  onClick={handleVoicePlay}
                  style={{
                    background: isPlaying ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '0 auto',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying ? 'Pause' : 'Play'} Voice Message
                </button>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'left' }}>
                <p><strong>Recorded:</strong> {new Date(qrData?.timestamp).toLocaleDateString()}</p>
                <p><strong>App:</strong> {qrData?.app}</p>
                <p><strong>Audio URL:</strong> {qrData?.content}</p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '40px', 
                borderRadius: '15px',
                marginBottom: '20px'
              }}>
                <ExternalLink size={64} color="#667eea" style={{ marginBottom: '20px' }} />
                <h4 style={{ marginBottom: '15px', color: '#333' }}>Link</h4>
                <p style={{ marginBottom: '25px', color: '#666' }}>
                  Open the link from Photo Play
                </p>
                <button
                  onClick={handleLinkOpen}
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '25px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '0 auto',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ExternalLink size={20} />
                  Open Link
                </button>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'left' }}>
                <p><strong>Link:</strong> {qrData?.content}</p>
                <p><strong>Created:</strong> {new Date(qrData?.timestamp).toLocaleDateString()}</p>
                <p><strong>App:</strong> {qrData?.app}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayPage; 