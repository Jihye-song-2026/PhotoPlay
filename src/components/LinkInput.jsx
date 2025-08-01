import React, { useState } from 'react';
import { Link, ExternalLink } from 'lucide-react';

const LinkInput = ({ onLinkReady }) => {
  const [link, setLink] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setLink(value);
    
    if (value.trim()) {
      const valid = validateURL(value);
      setIsValid(valid);
      if (valid) {
        onLinkReady(value);
      }
    } else {
      setIsValid(false);
      onLinkReady(null);
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      setLink(pastedText);
      const valid = validateURL(pastedText);
      setIsValid(valid);
      if (valid) {
        onLinkReady(pastedText);
      }
    }
  };

  return (
    <div className="voice-recorder">
      <h3>Add Link</h3>
      <p>Paste a URL to attach to your photo (Instagram, TikTok, website, etc.)</p>
      
      <div style={{ marginTop: '20px' }}>
        <input
          type="url"
          className="link-input"
          placeholder="https://www.instagram.com/your-profile"
          value={link}
          onChange={handleLinkChange}
          onPaste={handlePaste}
        />
        
        {link && (
          <div style={{ marginTop: '10px', textAlign: 'left' }}>
            {isValid ? (
              <div style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ExternalLink size={16} />
                <span>✓ Valid URL</span>
              </div>
            ) : (
              <div style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Link size={16} />
                <span>✗ Please enter a valid URL</span>
              </div>
            )}
          </div>
        )}
        
        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Supported platforms:</strong></p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            <li>• Instagram</li>
            <li>• TikTok</li>
            <li>• YouTube</li>
            <li>• Twitter/X</li>
            <li>• Any website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkInput; 