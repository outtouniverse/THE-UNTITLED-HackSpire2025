// VoiceChatInterface.jsx (NEW FILE)
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { FaMicrophone, FaStopCircle, FaSpinner, FaVolumeUp } from 'react-icons/fa'; // Using react-icons for cool buttons

// Assuming your Flask server runs on localhost:5000
const BACKEND_URL = 'http://localhost:5000';
const socket = io(BACKEND_URL);

export default function VoiceChatInterface({ character, onClose }) {
  const [status, setStatus] = useState('connecting'); // 'connecting', 'ready', 'listening', 'thinking', 'speaking', 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // Audio state and refs
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioInputProcessorRef = useRef(null); // For Web Audio API direct processing
  const audioQueueRef = useRef([]); // Queue for incoming audio chunks
  const audioPlayingRef = useRef(false); // Flag to check if audio is currently playing
  const characterAudioSourceNodeRef = useRef(null); // Current AudioBufferSourceNode for character speaking

  const characterColor = character.color || '#00bcd4'; // Default color

  // Effect for SocketIO connection and events
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setStatus('connected'); // Socket connected, now start the live chat
      // Send event to backend to start Gemini Live session
      socket.emit('start_live_chat', { character: character.name });
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setStatus('error');
      setErrorMessage('Disconnected from server.');
      stopRecording(); // Ensure recording stops on disconnect
      stopCharacterAudio(); // Stop any playing audio
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err);
      setStatus('error');
      setErrorMessage(`Connection error: ${err.message}`);
      stopRecording();
      stopCharacterAudio();
    });

    // Custom status updates from the backend
    socket.on('status_update', (data) => {
      console.log('Status update from backend:', data);
      setStatus(data.status);
      if (data.message) {
          setErrorMessage(data.message);
      } else {
          setErrorMessage(null); // Clear error message on non-error status
      }
      if (data.status === 'ready') {
         // Optionally clear previous error if now ready
         setErrorMessage(null);
      }
    });

    // Handle incoming audio chunks from the backend (Gemini speaking)
    socket.on('audio_output', (audioChunk) => {
      // audioChunk is binary data (raw 24kHz PCM)
      // console.log(`Received audio chunk (${audioChunk.byteLength} bytes)`);
      audioQueueRef.current.push(audioChunk);
      playNextAudioChunk(); // Attempt to play the chunk
    });


    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('status_update');
      socket.off('audio_output');
      socket.disconnect(); // Disconnect Socket.IO when component unmounts
      stopRecording();
      stopCharacterAudio();
    };
  }, [character]); // Re-run effect if character changes (e.g., component remounts)


  // Function to process and play the next chunk from the queue
  const playNextAudioChunk = async () => {
      if (audioPlayingRef.current || audioQueueRef.current.length === 0) {
          // Already playing or no chunks left
          // console.log('playNextAudioChunk: Already playing or queue empty');
          return;
      }

      audioPlayingRef.current = true;
      // console.log('playNextAudioChunk: Starting playback');
      setStatus('speaking'); // Update UI status

      const audioChunk = audioQueueRef.current.shift(); // Get the next chunk

      try {
          const audioContext = audioContextRef.current;
          if (!audioContext) {
              console.error('AudioContext not initialized');
              audioPlayingRef.current = false;
              return;
          }

          // Decode the incoming raw PCM data into an AudioBuffer
          // Gemini sends 24kHz, 16-bit little-endian PCM.
          // We need to convert the byte array to a Float32Array suitable for decodeAudioData.
          // This requires manually converting the 16-bit bytes.
          const numSamples = audioChunk.byteLength / 2; // 2 bytes per sample (16-bit)
          const audioBuffer = audioContext.createBuffer(1, numSamples, audioContext.sampleRate); // Assuming 24kHz output from Gemini matches client's sample rate capability or we need resampling
          const channelData = audioBuffer.getChannelData(0);
          const dataView = new DataView(audioChunk);

          for (let i = 0; i < numSamples; i++) {
              const sample = dataView.getInt16(i * 2, true); // true for little-endian
              channelData[i] = sample / 32768; // Normalize to Float32 range (-1 to 1)
          }


          const sourceNode = audioContext.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.connect(audioContext.destination);

          sourceNode.onended = () => {
              // console.log('playNextAudioChunk: Chunk playback ended');
              characterAudioSourceNodeRef.current = null;
              audioPlayingRef.current = false;
              // Play the next chunk if available
              if (audioQueueRef.current.length > 0) {
                  playNextAudioChunk();
              } else {
                 // Queue is empty after this chunk finishes
                 // The backend will send a 'generation_complete' status update eventually
                 // if no more audio is coming for this turn.
                 // setStatus('thinking'); // Revert to thinking if queue is empty? Maybe wait for backend signal.
              }
          };

          // Store reference to the currently playing source node
          if (characterAudioSourceNodeRef.current) {
              // Stop the previous node if somehow it's still playing (shouldn't happen with onended)
              try { characterAudioSourceNodeRef.current.stop(); } catch(e) {}
          }
          characterAudioSourceNodeRef.current = sourceNode;

          sourceNode.start(0); // Play immediately

      } catch (error) {
          console.error('Error playing audio chunk:', error);
          audioPlayingRef.current = false;
          characterAudioSourceNodeRef.current = null;
          // Continue trying to play the next chunk
          if (audioQueueRef.current.length > 0) {
             playNextAudioChunk();
          } else {
             setStatus('ready'); // Revert to ready if error playing and queue is empty
          }
      }
  };


  const stopCharacterAudio = () => {
       if (characterAudioSourceNodeRef.current) {
           try {
              characterAudioSourceNodeRef.current.stop();
              characterAudioSourceNodeRef.current.disconnect(); // Clean up
           } catch(e) {
               console.error("Error stopping character audio:", e);
           } finally {
              characterAudioSourceNodeRef.current = null;
              audioPlayingRef.current = false;
              audioQueueRef.current = []; // Clear queue on stop
           }
       }
  }

  // Function to handle starting microphone recording
  const startRecording = async () => {
    if (isRecording) return; // Prevent double-recording
    setErrorMessage(null); // Clear previous errors

    try {
      // Ensure AudioContext is resumed/created
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
         audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
      }
      const audioContext = audioContextRef.current;


      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // console.log('Microphone stream obtained.');

      // We need to process the audio to 16kHz, 16-bit, mono PCM
      // The simplest approach is using ScriptProcessorNode, though deprecated.
      // AudioWorklet is the modern way but more complex (requires separate worklet file).
      // Let's use ScriptProcessorNode for this example's simplicity.

      const sourceNode = audioContext.createMediaStreamSource(stream);
      // const bufferSize = 4096; // Or auto by setting to 0 (often 4096 or 8192)
      const bufferSize = 0; // Let browser choose buffer size
      const sampleRate = audioContext.sampleRate; // Original sample rate

      // Create a ScriptProcessorNode to process audio chunks
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1); // 1 input, 1 output channel
      audioInputProcessorRef.current = processor; // Store ref

      // Connect the nodes: source -> processor -> destination (optional, connects to speakers)
      // Connecting to destination is important for ScriptProcessorNode to work correctly.
      sourceNode.connect(processor);
      processor.connect(audioContext.destination); // Connect to output to ensure processing runs


      processor.onaudioprocess = (event) => {
        if (!isRecording) return; // Only process if recording is active

        // Get the audio data (Float32Array)
        const inputBuffer = event.inputBuffer;
        const audioData = inputBuffer.getChannelData(0); // Get mono channel

        // Convert Float32Array to Int16Array (16-bit PCM)
        const numSamples = audioData.length;
        const pcm16Array = new Int16Array(numSamples);
        for (let i = 0; i < numSamples; i++) {
            // Scale Float32 (-1 to 1) to Int16 (-32768 to 32767)
            const sample = Math.max(-1, Math.min(1, audioData[i])); // Clamp values
            pcm16Array[i] = sample * 32767;
        }

        // Resample if necessary (browser sample rate might not be 16kHz)
        // Simple resampling (like downsampling by skipping samples) is lossy.
        // Proper resampling requires more complex algorithms.
        // A quick way for demo is to check if sampleRate is a multiple of 16000
        // and downsample if needed. Or rely on backend if possible (but API asks for 16k input).
        // Let's implement a basic downsampling if needed. Target 16kHz.
        const targetSampleRate = 16000;
        let finalPcm16Array = pcm16Array;

        if (sampleRate > targetSampleRate) {
             // Basic downsampling by linear interpolation (not ideal quality but works for demo)
             const ratio = sampleRate / targetSampleRate;
             const newLength = Math.round(numSamples / ratio);
             const downsampledPcm16Array = new Int16Array(newLength);

             for (let i = 0; i < newLength; i++) {
                const index = Math.min(Math.floor(i * ratio), numSamples - 1); // Ensure index is within bounds
                const nextIndex = Math.min(Math.ceil(i * ratio), numSamples - 1);
                const fraction = (i * ratio) - index;

                // Linear interpolation
                downsampledPcm16Array[i] = pcm16Array[index] + fraction * (pcm16Array[nextIndex] - pcm16Array[index]);
             }
             finalPcm16Array = downsampledPcm16Array;
        } else if (sampleRate < targetSampleRate) {
            console.warn(`Browser sample rate (${sampleRate}Hz) is less than target 16kHz. Upsampling not implemented.`);
            // For demo, just send as is, but quality might be poor or API might reject.
            // In a real app, handle this or use a library.
        }


        // Convert Int16Array to ArrayBuffer (bytes)
        const audioBytes = finalPcm16Array.buffer;

        // Send the raw bytes over SocketIO
        socket.emit('audio_input', audioBytes);
        // console.log(`Sent ${audioBytes.byteLength} bytes to server`);

      };

      setIsRecording(true);
      setStatus('listening');
      console.log('Recording started.');

      // Store stream reference to stop it later
      mediaRecorderRef.current = stream;


    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('error');
      setErrorMessage(`Microphone access denied or error: ${error.message}`);
      setIsRecording(false);
    }
  };

  // Function to handle stopping microphone recording
  const stopRecording = () => {
    if (!isRecording) return; // Prevent double-stopping

    setIsRecording(false);
    console.log('Recording stopping.');

    // Stop the media stream tracks
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }

    // Disconnect the audio processor node if it exists
    if (audioInputProcessorRef.current && audioContextRef.current) {
       try {
          audioInputProcessorRef.current.disconnect();
          // Also disconnect the source node from the processor
          // Note: Getting the source node here is tricky if not stored.
          // A cleaner approach might be needed to manage the node graph.
          // For simplicity, just disconnecting the processor might suffice
          // if the source node is allowed to be garbage collected after stream stops.
       } catch(e) {
           console.error("Error disconnecting audio processor:", e);
       } finally {
           audioInputProcessorRef.current = null;
       }
    }


    // Send stop signal to the backend
    socket.emit('stop_audio_input');

    setStatus('thinking'); // Change status to thinking after user stops talking
  };

  // Toggle recording function
  const toggleRecording = () => {
    if (status === 'speaking') {
        // Cannot record while character is speaking
        console.log("Cannot record while character is speaking.");
        return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Determine button state and icon
  let micButtonIcon;
  let micButtonClass = 'mic-button';
  let statusText = '';

  switch (status) {
      case 'connecting':
          micButtonIcon = <FaSpinner className="spinner" />; // Spinner icon
          micButtonClass += ' disabled';
          statusText = 'Connecting...';
          break;
      case 'ready':
          micButtonIcon = <FaMicrophone />; // Mic icon
          micButtonClass += ' idle';
          statusText = 'Tap the mic to speak.';
          break;
      case 'listening':
          micButtonIcon = <FaMicrophone />;
          micButtonClass += ' listening';
          statusText = 'Listening...';
          break;
      case 'thinking':
          micButtonIcon = <FaSpinner className="spinner" />;
          micButtonClass += ' disabled'; // Disable while thinking
          statusText = 'Thinking...';
          break;
      case 'speaking':
          micButtonIcon = <FaVolumeUp />; // Speaker icon
          micButtonClass += ' speaking';
          statusText = `${character.name} speaking...`;
          break;
      case 'error':
           micButtonIcon = <FaMicrophone style={{color: '#fff'}} />; // Mic icon with red color
           micButtonClass += ' disabled'; // Disable on error
           statusText = 'Error occurred.';
           break;
      case 'connected': // Initial state after socket connect, before live chat starts
           micButtonIcon = <FaSpinner className="spinner" />;
           micButtonClass += ' disabled';
           statusText = 'Starting chat...';
           break;
      default:
          micButtonIcon = <FaMicrophone />;
          micButtonClass += ' idle';
          statusText = 'Loading...';
  }


  // Add animation class for spinner
  if (status === 'connecting' || status === 'thinking' || status === 'connected') {
      micButtonClass += ' spinning'; // Add a spinning class for the spinner icon
  }


  return (
    <div className="voice-chat-canvas-bg"> {/* Background overlay */}
      <div className="voice-chat-canvas"> {/* Main modal content */}
        <button className="close-btn" onClick={() => { stopRecording(); stopCharacterAudio(); onClose(); }} title="Close">×</button> {/* Close button */}

        <div className="voice-chat-header"> {/* Header area */}
          {character.img && (
              <img src={character.img} alt={character.name} className="character-img" />
          )}
          <div>
            <div className="character-name" style={{ color: characterColor }}>{character.name}</div>
            <div className="character-desc">{character.desc}</div>
          </div>
        </div>

        {/* Main interactive area */}
        <div className="voice-interaction-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            {/* Mic button */}
            <button
                className={micButtonClass}
                onClick={toggleRecording}
                disabled={status === 'connecting' || status === 'thinking' || status === 'speaking' || status === 'connected' || status === 'error'} // Disable based on status
            >
                {micButtonIcon}
            </button>

            {/* Status text */}
            <div className="status-text">{statusText}</div>

            {/* Error message display */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

             {/* Optional: Add a simple visualizer here */}
        </div>

      </div>
    </div>
  );
}