import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode } from 'lucide-react';

const QRCodeGenerator = ({ data, type, onQRReady, onGenerate }) => {
  const [qrCodeURL, setQrCodeURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [firebaseData, setFirebaseData] = useState(null);

  useEffect(() => {
    if (data && type === 'link') {
      // For links, generate QR code immediately
      generateQRCode(data);
    } else if (data && type === 'voice') {
      // For voice, show generate button
      setFirebaseData(null);
      setQrCodeURL(null);
    }
  }, [data, type]);

  const generateQRCode = async (content) => {
    if (!content) return;
    
    setIsGenerating(true);
    try {
      console.log('🔍 QR Code Generation Debug:');
      console.log('📡 Content received:', content);
      console.log('🔍 Content type:', typeof content);
      console.log('🔍 Content length:', content.length);
      
      // Check if content has %2F encoding
      const hasEncoding = content.includes('%2F');
      console.log('🔍 Content has %2F encoding:', hasEncoding);
      
      // Create a URL that points to our app with the data
      // Fix: Double-encode the content URL to preserve %2F encoding
      let processedContent = content;
      if (type === 'voice' && content.includes('%2F')) {
        // Double-encode to preserve %2F when JSON.stringify decodes it
        processedContent = content.replace(/%2F/g, '%252F');
        console.log('🔧 Double-encoding URL to preserve %2F');
        console.log('📡 Original:', content);
        console.log('🔧 Processed:', processedContent);
      }
      
      const qrData = {
        type: type, // 'voice' or 'link'
        content: processedContent,
        timestamp: new Date().toISOString(),
        app: 'Photo Play'
      };

      console.log('📋 QR Data object:', qrData);
      console.log('🔍 QR Data.content has %2F encoding:', qrData.content.includes('%2F'));
      
      // Fix: Ensure the content URL preserves encoding
      if (type === 'voice' && qrData.content.includes('%2F')) {
        console.log('✅ Content has proper %2F encoding, preserving it');
      } else if (type === 'voice' && !qrData.content.includes('%2F')) {
        console.log('⚠️ Content missing %2F encoding, this will cause issues');
      }

      // Encode the data as URL parameters
      const encodedData = encodeURIComponent(JSON.stringify(qrData));
      const appURL = `https://qr-ar-voice.web.app/play?data=${encodedData}`;
      
      console.log('🔗 Final QR Code URL:', appURL);
      console.log('🔍 Final URL has %2F encoding:', appURL.includes('%2F'));

      const qrCodeDataURL = await QRCode.toDataURL(appURL, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeURL(qrCodeDataURL);
      onQRReady(qrCodeDataURL);
      console.log('✅ QR Code generated successfully');
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVoiceQR = async () => {
    if (onGenerate) {
      try {
        console.log('🔄 Starting voice QR generation...');
        const firebaseURL = await onGenerate();
        console.log('📡 Received Firebase URL:', firebaseURL);
        
        if (firebaseURL) {
          console.log('✅ Firebase URL received, generating QR code...');
          setFirebaseData(firebaseURL);
          generateQRCode(firebaseURL);
        } else {
          console.error('❌ No Firebase URL received from onGenerate');
        }
      } catch (error) {
        console.error('❌ Error generating voice QR code:', error);
      }
    }
  };

  const downloadQRCode = () => {
    if (qrCodeURL) {
      const link = document.createElement('a');
      link.download = `qr-code-${type}-${Date.now()}.png`;
      link.href = qrCodeURL;
      link.click();
    }
  };

  if (isGenerating) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Generating QR Code...</p>
      </div>
    );
  }

  if (type === 'voice' && !qrCodeURL) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h3>Voice Recording Ready</h3>
        <p>Your voice recording is ready. Click the button below to upload to Firebase and generate a QR code.</p>
        <button
          className="generate-btn"
          onClick={handleGenerateVoiceQR}
          disabled={isGenerating}
        >
          {isGenerating ? 'Uploading...' : 'Generate QR Code'}
        </button>
      </div>
    );
  }

  if (!qrCodeURL) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>QR Code Generated!</h3>
      <p>This QR code contains your {type === 'voice' ? 'voice recording' : 'link'}</p>
      
      <div style={{ margin: '20px 0' }}>
        <img 
          src={qrCodeURL} 
          alt="QR Code" 
          style={{ 
            maxWidth: '200px', 
            border: '2px solid #ddd',
            borderRadius: '10px',
            padding: '10px',
            background: 'white'
          }} 
        />
      </div>
      
      <button 
        className="download-btn"
        onClick={downloadQRCode}
      >
        <Download size={16} />
        Download QR Code
      </button>
      
      <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>How it works:</strong></p>
        <p>When someone scans this QR code:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
          {type === 'voice' ? (
            <li>• Opens Photo Play app to play your voice recording</li>
          ) : (
            <li>• Opens Photo Play app to access your link</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default QRCodeGenerator; 