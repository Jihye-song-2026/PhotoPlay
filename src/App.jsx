import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload, Mic, Link, Image, TestTube } from 'lucide-react';
import VoiceRecorder from './components/VoiceRecorder';
import LinkInput from './components/LinkInput';
import QRCodeGenerator from './components/QRCodeGenerator';
import PhotoWithQR from './components/PhotoWithQR';
import PlayPage from './components/PlayPage';
import TestAudio from './components/TestAudio';
import { uploadAudioFile } from './firebase';

function MainApp() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [link, setLink] = useState(null);
  const [qrCodeURL, setQrCodeURL] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTests, setShowTests] = useState(false);

  const fileInputRef = useRef(null);

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedPhoto(file);
      setPhotoURL(URL.createObjectURL(file));
      setSelectedOption(null);
      setAudioBlob(null);
      setLink(null);
      setQrCodeURL(null);
      setError(null);
      setSuccess(null);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedPhoto(file);
        setPhotoURL(URL.createObjectURL(file));
        setSelectedOption(null);
        setAudioBlob(null);
        setLink(null);
        setQrCodeURL(null);
        setError(null);
        setSuccess(null);
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setError(null);
  };

  const handleAudioReady = (blob) => {
    setAudioBlob(blob);
    setError(null);
  };

  const handleLinkReady = (url) => {
    setLink(url);
    setError(null);
  };

  const handleQRReady = (qrURL) => {
    setQrCodeURL(qrURL);
  };

  const generateQRCode = async () => {
    if (!selectedPhoto) {
      setError('Please select a photo first.');
      return;
    }

    if (!selectedOption) {
      setError('Please select an option (voice or link).');
      return;
    }

    if (selectedOption === 'voice' && !audioBlob) {
      setError('Please record your voice first.');
      return;
    }

    if (selectedOption === 'link' && !link) {
      setError('Please enter a valid link.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      let qrData;

      if (selectedOption === 'voice') {
        console.log('Starting voice upload process...');
        console.log('Audio blob:', audioBlob);
        console.log('Audio blob size:', audioBlob.size);
        console.log('Audio blob type:', audioBlob.type);
        
        // Upload audio to Firebase and get URL
        const fileExtension = audioBlob.type.includes('webm') ? 'webm' : 
                             audioBlob.type.includes('mp4') ? 'mp4' : 
                             audioBlob.type.includes('wav') ? 'wav' : 'mp3';
        const fileName = `audio-${Date.now()}.${fileExtension}`;
        console.log('Uploading to Firebase with filename:', fileName);
        console.log('Audio blob type:', audioBlob.type);
        
        const audioURL = await uploadAudioFile(audioBlob, fileName);
        console.log('Firebase upload successful, URL:', audioURL);
        
        setSuccess('Voice recording uploaded successfully!');
        setIsProcessing(false);
        return audioURL; // Return the Firebase URL
      } else {
        // Use the link directly
        setSuccess('Link ready for QR code generation!');
        setIsProcessing(false);
        return link; // Return the link
      }
    } catch (error) {
      console.error('Error processing:', error);
      setError(`An error occurred while processing: ${error.message}`);
      setIsProcessing(false);
      return null;
    }
  };

  const resetApp = () => {
    setSelectedPhoto(null);
    setPhotoURL(null);
    setSelectedOption(null);
    setAudioBlob(null);
    setLink(null);
    setQrCodeURL(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Photo Play</h1>
        <p>Add voice recordings or links to your photos and generate interactive QR codes</p>
        <button
          onClick={() => setShowTests(!showTests)}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto',
            fontSize: '0.9rem'
          }}
        >
          <TestTube size={16} />
          {showTests ? 'Hide Tests' : 'Show Tests'}
        </button>
      </div>

      {showTests && <TestAudio />}

      <div className="main-content">
        {!selectedPhoto ? (
          <div
            className="upload-section"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="upload-icon" />
            <div className="upload-text">Click to select a photo or drag and drop</div>
            <div className="upload-hint">Supports JPG, PNG, GIF, and other image formats</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <>
            {/* Photo Preview */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3>Selected Photo</h3>
              <img 
                src={photoURL} 
                alt="Selected photo" 
                style={{ 
                  maxWidth: '300px', 
                  maxHeight: '300px', 
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }} 
              />
              <button 
                onClick={resetApp}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
              >
                Choose Different Photo
              </button>
            </div>

            {/* Options Selection */}
            {!selectedOption && (
              <div>
                <h3>Choose what to add to your photo:</h3>
                <div className="options-section">
                  <div 
                    className="option-card"
                    onClick={() => handleOptionSelect('voice')}
                  >
                    <Mic className="option-icon" />
                    <div className="option-title">Add Your Voice</div>
                    <div className="option-description">
                      Record a voice message that will be accessible when someone scans the QR code
                    </div>
                  </div>
                  
                  <div 
                    className="option-card"
                    onClick={() => handleOptionSelect('link')}
                  >
                    <Link className="option-icon" />
                    <div className="option-title">Add Your Link</div>
                    <div className="option-description">
                      Add a link to your social media, website, or any URL
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Recorder */}
            {selectedOption === 'voice' && (
              <VoiceRecorder onAudioReady={handleAudioReady} />
            )}

            {/* Link Input */}
            {selectedOption === 'link' && (
              <LinkInput onLinkReady={handleLinkReady} />
            )}

            {/* Error and Success Messages */}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {/* QR Code Generator */}
            {selectedOption && (
              <QRCodeGenerator
                data={selectedOption === 'voice' ? (audioBlob ? 'ready' : null) : link}
                type={selectedOption}
                onQRReady={handleQRReady}
                onGenerate={generateQRCode}
              />
            )}

            {/* Final Result with Photo and QR */}
            {qrCodeURL && photoURL && (
              <PhotoWithQR
                photoURL={photoURL}
                qrCodeURL={qrCodeURL}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </Router>
  );
}

export default App; 