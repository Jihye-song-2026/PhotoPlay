import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Upload } from 'lucide-react';

const VoiceRecorder = ({ onAudioReady }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try different MIME types for better compatibility
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/wav';
      }
      
      console.log('Using MIME type:', mimeType);
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioReady(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setRecordingTime(0);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      timerRef.current = timer;
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      <h3>Voice Recorder</h3>
      <p>Record your voice message to attach to the photo</p>
      
      <div className="recorder-controls">
        {!isRecording && !audioURL && (
          <button 
            className="record-btn"
            onClick={startRecording}
          >
            <Mic size={20} />
            Start Recording
          </button>
        )}
        
        {isRecording && (
          <button 
            className="record-btn recording"
            onClick={stopRecording}
          >
            <Square size={20} />
            Stop Recording ({formatTime(recordingTime)})
          </button>
        )}
        
        {audioURL && (
          <button 
            className="record-btn"
            onClick={playAudio}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            {isPlaying ? 'Pause' : 'Play'} Recording
          </button>
        )}
      </div>
      
      {audioURL && (
        <div style={{ marginTop: '20px' }}>
          <audio 
            ref={audioRef}
            src={audioURL}
            onEnded={() => setIsPlaying(false)}
            style={{ display: 'none' }}
          />
          <p style={{ color: '#28a745', fontWeight: '600' }}>
            ✓ Audio recorded successfully! ({formatTime(recordingTime)})
          </p>
        </div>
      )}
      
      {isRecording && (
        <div style={{ marginTop: '20px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p>Recording in progress...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder; 