import React from 'react';
import { Download, Share2 } from 'lucide-react';

const PhotoWithQR = ({ photoURL, qrCodeURL, onDownload }) => {
  const downloadCombinedImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const qrImg = new Image();

    img.onload = () => {
      // Set canvas size to match photo
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original photo
      ctx.drawImage(img, 0, 0);

      // Calculate QR code position (bottom right corner)
      const qrSize = Math.min(img.width * 0.15, img.height * 0.15); // 15% of photo size
      const qrX = img.width - qrSize - 20; // 20px margin from right
      const qrY = img.height - qrSize - 20; // 20px margin from bottom

      // Add a white background for the QR code
      ctx.fillStyle = 'white';
      ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      // Draw the QR code
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `photo-with-qr-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      qrImg.src = qrCodeURL;
    };

    img.src = photoURL;
  };

  const shareImage = async () => {
    try {
      if (navigator.share) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const qrImg = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const qrSize = Math.min(img.width * 0.15, img.height * 0.15);
          const qrX = img.width - qrSize - 20;
          const qrY = img.height - qrSize - 20;

          ctx.fillStyle = 'white';
          ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

          qrImg.onload = () => {
            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

            canvas.toBlob(async (blob) => {
              const file = new File([blob], 'photo-with-qr.png', { type: 'image/png' });
              await navigator.share({
                title: 'Photo with QR Code',
                text: 'Check out this photo with an interactive QR code!',
                files: [file]
              });
            }, 'image/png');
          };

          qrImg.src = qrCodeURL;
        };

        img.src = photoURL;
      } else {
        // Fallback for browsers that don't support Web Share API
        downloadCombinedImage();
      }
    } catch (error) {
      console.error('Error sharing image:', error);
      downloadCombinedImage();
    }
  };

  return (
    <div className="result-section">
      <h3>Your Photo with QR Code</h3>
      <p>The QR code is positioned in the bottom right corner</p>
      
      <div className="photo-container">
        <img src={photoURL} alt="Your photo with QR code" />
        <div className="qr-overlay">
          <img 
            src={qrCodeURL} 
            alt="QR Code" 
            style={{ 
              width: '80px', 
              height: '80px',
              display: 'block'
            }} 
          />
        </div>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button 
          className="download-btn"
          onClick={downloadCombinedImage}
        >
          <Download size={16} />
          Download Photo with QR
        </button>
        
        <button 
          className="download-btn"
          onClick={shareImage}
          style={{ background: '#007bff' }}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>What happens when someone scans the QR code?</strong></p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0', textAlign: 'left' }}>
          <li>• <strong>Voice recordings:</strong> Opens a player to listen to your audio</li>
          <li>• <strong>Links:</strong> Opens the URL in the appropriate app or browser</li>
          <li>• <strong>Social media:</strong> Opens in the native app if installed</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoWithQR; 