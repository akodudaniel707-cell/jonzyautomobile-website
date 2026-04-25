import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send, X } from 'lucide-react';

interface VoiceRecorderProps {
  onVoiceMessage: (audioBlob: Blob) => void;
  onClose: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceMessage, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onVoiceMessage(audioBlob);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Voice Message</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-center space-y-4">
        {isRecording && (
          <div className="text-red-500 font-mono text-lg">
            Recording: {formatTime(recordingTime)}
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="text-green-600 font-mono text-sm">
            Recording ready ({formatTime(recordingTime)})
          </div>
        )}

        <div className="flex justify-center space-x-3">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4"
            >
              <Mic className="w-6 h-6" />
            </Button>
          )}

          {isRecording && (
            <Button
              onClick={stopRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-4"
            >
              <MicOff className="w-6 h-6" />
            </Button>
          )}

          {audioBlob && !isRecording && (
            <Button
              onClick={sendVoiceMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4"
            >
              <Send className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;