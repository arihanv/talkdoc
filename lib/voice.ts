import { useState, useRef, useCallback, useEffect } from "react";
import type { AudioModelSettings } from "@/lib/store";

export function useAudioPlayer(text: string, modelOptions: AudioModelSettings) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [chunksReceived, setChunksReceived] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const isBufferingRef = useRef<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update progress when currentTime or duration changes
  useEffect(() => {
    if (duration > 0 && !Number.isNaN(duration) && !Number.isNaN(currentTime)) {
      setProgress((currentTime / duration) * 100);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration]);

  const startTimeTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const time = audioRef.current.currentTime;
        if (!Number.isNaN(time)) {
          setCurrentTime(time);
        }
        
        const audioDuration = audioRef.current.duration;
        if (audioDuration && !Number.isNaN(audioDuration) && audioDuration !== Number.POSITIVE_INFINITY) {
          setDuration(audioDuration);
        }
      }
    }, 100);
  }, []);

  const handlePlay = useCallback(async () => {
    if (!text) return;

    // If we're resuming from pause
    if (isPaused && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
      startTimeTracking();
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);
    setIsGenerated(true);
    isBufferingRef.current = true;
    setIsStreaming(true);
    setChunksReceived(0);

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    const audioElement = new Audio();
    audioRef.current = audioElement;

    // Set up time update event
    audioElement.addEventListener('timeupdate', () => {
      const time = audioElement.currentTime;
      if (!Number.isNaN(time)) {
        setCurrentTime(time);
      }
      
      const audioDuration = audioElement.duration;
      if (audioDuration && !Number.isNaN(audioDuration) && audioDuration !== Number.POSITIVE_INFINITY) {
        setDuration(audioDuration);
      }
    });

    // Set up ended event
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audioElement.src = URL.createObjectURL(mediaSource);
    audioElement.play();
    startTimeTracking();

    mediaSource.addEventListener("sourceopen", async () => {
      const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg"); // MP3 format
      let totalBytes = 0;
      let estimatedDuration = 0;

      const url = `${process.env.NEXT_PUBLIC_VOICE_SERVER_URL}/stream_audio`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text, 
          modelOptions
        }),
      });

      if (!response.body) {
        console.error("No response body");
        setIsPlaying(false);
        isBufferingRef.current = false;
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();

      async function processStream() {
        try {
          while (isBufferingRef.current) {
            const { done, value } = await reader.read();
            if (done) {
              if (mediaSource.readyState === 'open') {
                mediaSource.endOfStream();
              }
              isBufferingRef.current = false;
              setIsStreaming(false);
              break;
            }

            // Estimate duration based on bytes received (rough approximation)
            // MP3 at 128kbps = ~16KB per second
            if (value) {
              totalBytes += value.length;
              estimatedDuration = totalBytes / 16000; // Very rough estimate
              if (estimatedDuration > 0 && !Number.isNaN(estimatedDuration) && estimatedDuration !== Number.POSITIVE_INFINITY) {
                setDuration(Math.max(estimatedDuration, duration || 0));
              }
              setChunksReceived(prev => prev + 1);
            }

            // Wait if the sourceBuffer is updating
            if (sourceBuffer.updating) {
              await new Promise<void>((resolve) => {
                sourceBuffer.addEventListener('updateend', () => resolve(), { once: true });
              });
            }

            // Check if mediaSource is still open before appending
            if (mediaSource.readyState === 'open') {
              sourceBuffer.appendBuffer(value);
              
              // Wait for this append to complete before continuing
              await new Promise<void>((resolve) => {
                sourceBuffer.addEventListener('updateend', () => resolve(), { once: true });
              });
            } else {
              console.error('MediaSource not open, state:', mediaSource.readyState);
              isBufferingRef.current = false;
              break;
            }
          }
        } catch (error) {
          console.error('Error processing audio stream:', error);
          setIsPlaying(false);
          isBufferingRef.current = false;
          setIsStreaming(false);
        }
      }

      processStream();
    });
  }, [text, isPaused, duration, startTimeTracking]);

  const handlePause = useCallback(() => {
    // Just pause the audio but keep the buffer
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const handleStop = useCallback(() => {
    // Complete stop, clear everything
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    isBufferingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setProgress(0);
    mediaSourceRef.current = null;
  }, []);

  const handleReset = useCallback(() => {
    // Reset audio generation state
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    isBufferingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setIsGenerated(false);
    setCurrentTime(0);
    setProgress(0);
    setDuration(0);
    setIsStreaming(false);
    setChunksReceived(0);
    mediaSourceRef.current = null;
  }, []);

  // Format time as MM:SS, safely handling NaN and Infinity
  const formatTime = useCallback((timeInSeconds: number) => {
    if (Number.isNaN(timeInSeconds) || !Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
      return "0:00";
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  return {
    isPlaying,
    isPaused,
    isGenerated,
    currentTime,
    duration,
    progress,
    isStreaming,
    chunksReceived,
    formatTime,
    play: handlePlay,
    pause: handlePause,
    stop: handleStop,
    reset: handleReset
  };
}
