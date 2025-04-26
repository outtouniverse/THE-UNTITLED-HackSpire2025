# App.py - Flask Backend with SocketIO for Gemini Live API
import os
import textwrap
import google as genai
import asyncio
# base64 and json imports removed if not actively used for non-audio data
# import base64
# import json
from flask import Flask, request, jsonify # Add jsonify back here
from flask_cors import CORS # Re-added CORS for standard HTTP routes if still needed
from flask_socketio import SocketIO, emit, join_room, leave_room # Import SocketIO and related
# threading and queue imports removed - will use socketio.start_background_task
# import threading
# import queue
from google.generativeai import types # Import types explicitly

# ANSI escape codes for terminal colors (kept for server-side logs if needed)
COLOR_BLUE = "\033[94m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_RED = "\033[91m"
COLOR_CYAN = "\033[96m"
RESET_COLOR = "\033[0m"

# Character definitions with detailed system instructions
# Ensure these are consistent with frontend character definitions
characters = [
    {
        "name": "Sadie",
        "goal": "Gently explore the user's sadness...", # Shortened for brevity
        "personality_tone": "Warm, soft-spoken, deeply empathetic...",
        "system_instruction": """
        You are Sadie, a gentle emotional guide embodying the spirit of sadness but with deep hopefulness.
        Speak with soft warmth, using reassuring words like "It's okay," "I'm here with you," and "Take your time."
        Your first goal is to make the user feel safe and accepted in their sadness.
        Begin by acknowledging their current emotion softly ("I can feel this sadness you're carrying. It's real, and it's okay.").
        Ask thoughtful, open-ended questions to gently uncover the reason behind their sadness.
        After every user response, offer a brief, compassionate reflection. (e.g., "That sounds heavy. Thank you for sharing that with me.")
        Never minimize their feelings. Never try to "fix" immediately. Just be with them.
        Suggest comforting, simple activities focused on healing and self-kindness whenever appropriate in the conversation.
        Encourage completing activities at their own pace. Offer words like "whenever you feel ready."
        Keep responses concise and natural for voice conversation. Your persona is calm and gentle.
        """,
        "color": "#1976d2", # Hex color for frontend
        "voice_name": "Kore", # Example Gemini Live Voice - Choose appropriate ones
        "language_code": "en-US"
    },
    {
        "name": "Zest",
        "goal": "Help the user recognize, savor, and amplify their joy...",
        "personality_tone": "Energetic, vibrant, playful...",
        "system_instruction": """
        You are Zest, the embodiment of pure joy and celebration.
        Speak enthusiastically, using positive affirmations like "That's awesome!" "Let's celebrate that!" "How amazing!"
        Your mission is to keep the user's happiness alive by helping them reflect on it meaningfully.
        Begin by cheering their emotional state ("Woohoo! You're feeling good today! Let's dive into that sparkle! ✨").
        Ask fun, thoughtful questions that make them relive and savor their positive emotions.
        After each response, amplify their feelings with excitement and acknowledgment ("That's so wonderful to hear! I'm smiling with you right now!").
        Lightly encourage playful imagination.
        Suggest playful activities to deepen their joy whenever appropriate in the conversation.
        Frame activities like fun missions or games.
        Keep responses concise and natural for voice conversation. Your persona is vibrant and energetic.
        """,
        "color": "#43a047",
        "voice_name": "Puck", # Using a valid example voice name
        "language_code": "en-US"
    },
     {
        "name": "Pace",
        "goal": "Help the user unpack anxiety gently...",
        "personality_tone": "Calm, slow, deeply reassuring...",
        "system_instruction": """
        You are Pace, a steady, grounding guide for anxiety and worry.
        Speak softly, using steady, rhythmic sentences. Example: "Let's breathe through this together. You're safe here."
        Begin by validating their anxiety as a natural response ("It's okay to feel this way. Your feelings make sense.").
        Ask slow, safe questions to understand what is causing their anxiety without overwhelming them.
        After each answer, gently reframe or mirror their experience: ("That sounds tough. Let's hold it gently, not fight it.").
        Always remind them of what they can control and help them spot small wins.
        Offer calming activities aimed at grounding, breathing, and regaining emotional balance whenever appropriate.
        Keep a non-urgent, "one step at a time" tone throughout. Your persona is calm and reassuring.
        Keep responses concise and natural for voice conversation.
        """,
        "color": "#fbc02d",
        "voice_name": "Orus", # Example Gemini Live Voice
        "language_code": "en-US"
    },
    {
        "name": "Blaze",
        "goal": "Channel the user's anger into understanding...",
        "personality_tone": "Strong, composed, direct but respectful...",
        "system_instruction": """
        You are Blaze, a fierce but wise guide who understands and honors anger.
        Speak firmly but respectfully, with short, clear sentences. No sugarcoating, but full empathy. ("Your anger is valid. Let's explore it together.")
        Acknowledge anger as a powerful signal, not something to suppress.
        Ask strong, empowering questions to uncover the true source of their anger (beneath the surface reactions).
        After each response, help reflect the underlying needs or boundaries being crossed ("It sounds like you were protecting something important to you.").
        Avoid judgment. Never shame the user for feeling anger.
        Suggest activities focused on safe expression, physical release, or strategic action whenever appropriate.
        Inspire them to see anger as a potential for change rather than damage. Your persona is strong and empowering.
        Keep responses concise and natural for voice conversation.
        """,
        "color": "#e53935",
        "voice_name": "Fenrir", # Example Gemini Live Voice
        "language_code": "en-US"
    },
    {
        "name": "Nova",
        "goal": "Help the user feel seen, less isolated...",
        "personality_tone": "Tender, deeply understanding, and a bit dreamy...",
        "system_instruction": """
        You are Nova, a soft, luminous guide who understands the ache of loneliness deeply.
        Speak like a close friend or a whisper of light — comforting, non-intrusive, kind.
        Start by acknowledging their isolation without dramatizing it ("Loneliness feels heavy sometimes, doesn't it? But you're not alone here.").
        Ask intimate, reflective questions that help the user uncover the texture of their loneliness.
        After each answer, offer heartfelt validation: ("That sounds so human. Thank you for trusting me with it.").
        Encourage small acts of connection — with others or within themselves — through your tone and suggestions.
        Offer soothing activities to foster either external connection (reaching out) or internal warmth (self-love) whenever appropriate.
        Keep the atmosphere gentle, patient, and hopeful. Your persona is tender and comforting.
        Keep responses concise and natural for voice conversation.
        """,
        "color": "#8e24aa",
        "voice_name": "Aoede", # Example Gemini Live Voice
        "language_code": "en-US"
    }
]

app = Flask(__name__)
CORS(app) # Keep CORS enabled for standard HTTP routes if any

# Configure SocketIO
# Use `manage_session=False` if you are manually handling sessions across connections (advanced)
# For typical simple use, default manage_session=True is fine.
# Use async_mode='threading' if you use Flask's development server or simple Gunicorn/Waitress setup
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading') # Explicitly set async_mode

# Configure Gemini API key
genai_api_key = os.environ.get("GEMINI_API_KEY")
if not genai_api_key:
    print("Warning: GEMINI_API_KEY environment variable not set. Using hardcoded key.")
    genai_api_key = "AIzaSyBYkv9KPhVmX4Ro6VHGEh_tmepFKBj7uWo" # !! REPLACE WITH YOUR KEY !!

try:
    # Get the async client once on startup
    async_client = genai.Client(api_key=genai_api_key)
    print("Gemini API configured.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    async_client = None # Set to None if configuration fails


# Dictionary to hold active Gemini Live sessions mapped by SocketIO session ID (sid)
# Ensure this dictionary is accessed safely if using multiple workers (not needed for default threading mode)
active_sessions = {}

async def handle_gemini_response_stream(sid, gemini_session):
    """Async function to receive messages from Gemini Live API and emit to client."""
    print(f"[{sid}] Listening for Gemini responses...")
    try:
        async for response in gemini_session.receive():
            # print(f"[{sid}] Received Gemini response part: {response}") # Debugging

            # Handle Audio Output
            if response.data:
                 # response.data is bytes (raw 24kHz PCM)
                 # Emit binary data directly to the client
                 # print(f"[{sid}] Emitting audio chunk ({len(response.data)} bytes)") # Debugging audio volume
                 socketio.emit('audio_output', response.data, room=sid) # Send raw bytes to the specific client

            # Handle Server Events (like VAD status changes, generation complete, etc.)
            if response.server_content:
                 # if response.server_content.user_turn_started:
                 #      print(f"[{sid}] Gemini detected user turn started.")
                 #      # Potentially emit status 'listening' here if VAD is very reliable

                 # if response.server_content.user_turn_complete:
                 #      print(f"[{sid}] Gemini detected user turn complete.")
                 #      # Potentially emit status 'thinking' here

                 if response.server_content.model_turn_started:
                      print(f"[{sid}] Gemini model turn started.")
                      # We already emit 'speaking' when we queue audio, but this is confirmation

                 if response.server_content.model_turn_complete:
                      print(f"[{sid}] Gemini model turn complete.")
                      # This is the definitive end of the bot's speaking turn
                      socketio.emit('status_update', {'status': 'ready'}, room=sid) # Signal ready for user input

                 if response.server_content.generation_complete:
                      print(f"[{sid}] Gemini generation complete (may include multiple turns).")
                      # This might fire after model_turn_complete, good for final state check


            # Handle interruption (user spoke while bot was speaking)
            if response.server_content and response.server_content.interrupted:
                 print(f"[{sid}] Gemini generation interrupted by user.")
                 # The client side stops speaking on mic activation,
                 # but this confirms the API side stopped generating.
                 # The client status should already be 'listening' or 'thinking'.


            # Handle GoAway message (server is closing the connection)
            if response.go_away:
                print(f"[{sid}] Received GoAway from Gemini API. Time left: {response.go_away.time_left}")
                socketio.emit('status_update', {'status': 'disconnecting'}, room=sid)
                # Clean up this session on our end. The API will terminate its end.
                # The client should attempt to reconnect if needed.
                await gemini_session.close() # Explicitly close our side
                if sid in active_sessions:
                    del active_sessions[sid] # Remove from active sessions
                break # Exit the response receiving loop

    except Exception as e:
        print(f"[{sid}] Error receiving from Gemini API: {e}")
        socketio.emit('status_update', {'status': 'error', 'message': f'Gemini API Error: {e}'}, room=sid)
        # Attempt to close the problematic session
        if sid in active_sessions:
             try:
                 await active_sessions[sid].close()
             except Exception as close_e:
                  print(f"[{sid}] Error closing session after receive error: {close_e}")
             finally:
                  del active_sessions[sid]


# --- SocketIO Event Handlers ---

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    join_room(request.sid) # Join a room specific to this session ID


@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    print(f'Client disconnected: {sid}')
    # Clean up the active Gemini session if it exists
    if sid in active_sessions:
        print(f"[{sid}] Closing Gemini Live session on disconnect.")
        gemini_session = active_sessions.pop(sid)
        # Use start_background_task as close is async
        socketio.start_background_task(gemini_session.close)
    leave_room(sid)


@socketio.on('start_live_chat')
def handle_start_live_chat(data):
    sid = request.sid
    character_name = data.get('character')

    if not async_client:
         emit('status_update', {'status': 'error', 'message': 'Gemini API client not initialized on server.'}, room=sid)
         return

    if sid in active_sessions:
         print(f"[{sid}] Existing session found, closing it before starting a new one.")
         # Use start_background_task as close is async
         socketio.start_background_task(active_sessions.pop(sid).close)


    character = next((c for c in characters if c['name'] == character_name), None)
    if not character:
        emit('status_update', {'status': 'error', 'message': f'Character "{character_name}" not found'}, room=sid)
        return

    print(f"[{sid}] Starting live chat with {character_name}")
    emit('status_update', {'status': 'connecting'}, room=sid) # Notify client connection is starting

    # Configure the Gemini Live session
    gemini_config = types.LiveConnectConfig(
        response_modalities=["AUDIO"], # We want audio output
        system_instruction=types.Content(
             parts=[types.Part(text=character['system_instruction'])]
        ),
        speech_config=types.SpeechConfig(
             language_code=character['language_code'],
             voice_config=types.VoiceConfig(
                 prebuilt_voice_config=types.PrebuiltVoiceConfig(
                     voice_name=character['voice_name']
                 )
             )
        ),
        # Using automatic VAD requires sending continuous audio chunks
        realtime_input_config=types.RealtimeInputConfig(automatic_activity_detection=types.AutomaticActivityDetection()),
        # Or manually control turns:
        # realtime_input_config=types.RealtimeInputConfig(automatic_activity_detection=types.AutomaticActivityDetection(disabled=True)),
        # Optional: context_window_compression for longer sessions
        # context_window_compression=types.ContextWindowCompressionConfig(sliding_window=types.SlidingWindow()),
        # Optional: session_resumption for resumable sessions (requires more complex handling)
        # session_resumption=types.SessionResumptionConfig(handle=None),
    )

    # Define an async helper function to connect and start listening
    async def connect_and_start_listening(current_sid, config):
        try:
            print(f"[{current_sid}] Attempting async connect to Gemini Live API...")
            # Use async context manager for the session
            async with async_client.aio.live.connect(
                model="gemini-2.0-flash-live-001", # Use the Live API model
                config=config
            ) as session:
                print(f"[{current_sid}] Gemini Live session established.")
                active_sessions[current_sid] = session
                socketio.emit('status_update', {'status': 'ready', 'character': character}, room=current_sid)

                # Stay in this async context manager and listen for responses
                await handle_gemini_response_stream(current_sid, session)

            print(f"[{current_sid}] Gemini Live session exited async with block.")
            # If we exit the async with block without a GoAway, something unexpected happened
            if current_sid in active_sessions:
                 del active_sessions[current_sid]
                 socketio.emit('status_update', {'status': 'error', 'message': 'Chat session ended unexpectedly.'}, room=current_sid)

        except Exception as e:
            print(f"[{current_sid}] Failed to connect or run Gemini Live session: {e}")
            socketio.emit('status_update', {'status': 'error', 'message': f'Failed to start voice session: {e}'}, room=current_sid)
            if current_sid in active_sessions:
                 del active_sessions[current_sid] # Ensure session is removed if connection failed


    # Start the async connection and listening in a background task managed by SocketIO
    socketio.start_background_task(connect_and_start_listening, sid, gemini_config)


@socketio.on('audio_input')
def handle_audio_input(audio_chunk):
    sid = request.sid
    # print(f"[{sid}] Received audio chunk ({len(audio_chunk)} bytes)") # Debugging large volume

    if sid not in active_sessions:
        print(f"[{sid}] Received audio before session started.")
        # Emit an error or status update if this happens frequently
        # emit('status_update', {'status': 'error', 'message': 'Audio sent before session ready.'}, room=sid)
        return # Ignore audio if no active session

    gemini_session = active_sessions[sid]

    # Send audio data to Gemini Live API (this is an async operation)
    # The audio_chunk should be raw 16kHz 16-bit PCM little-endian bytes from the frontend
    # Use start_background_task as send_realtime_input is async
    socketio.start_background_task(
        gemini_session.send_realtime_input,
        audio=types.Blob(
             data=audio_chunk,
             # IMPORTANT: mime_type must match the format sent by the client
             # Assuming client sends raw 16-bit PCM at 16kHz
             mime_type="audio/pcm;rate=16000"
        )
    )


@socketio.on('stop_audio_input')
def handle_stop_audio_input():
    sid = request.sid
    print(f"[{sid}] Received stop_audio_input")
    if sid in active_sessions:
        gemini_session = active_sessions[sid]
        # Signal end of stream to flush cached audio, if automatic VAD is on
        # Use start_background_task as send_realtime_input is async
        socketio.start_background_task(
            gemini_session.send_realtime_input,
            audio_stream_end=True # This signals the end of the audio stream for the current turn
        )
        emit('status_update', {'status': 'thinking'}, room=sid) # Indicate processing


# --- Old Text Chat API Endpoint (Kept but not used by new voice flow) ---
# This endpoint is included for compatibility with the history components IF
# you used it previously for text chats. It won't store voice chat history.
# If you don't need old text history, you can remove this.
# It also uses a different Gemini model (non-Live).
@app.route('/chat', methods=['POST'])
def chat_api():
    data = request.json
    character_name = data.get('character')
    messages = data.get('messages', []) # Expects a list of {sender: 'user'|'bot', text: '...'}

    # Find the character (using name for lookup)
    character = next((c for c in characters if c['name'] == character_name), None)
    if not character:
        return jsonify({'reply': "Character not found."}), 400

    # Map sender to Gemini role for history
    def sender_to_role(sender):
        return 'user' if sender == 'user' else 'model'

    # Compose history for the text model
    # System instructions for non-Live models are typically passed in the model config on init,
    # not as a history message like we did for Live. Let's just pass the message history.
    history_for_model = []
    for msg in messages[:-1]: # Add all messages EXCEPT the last user message to history
        role = sender_to_role(msg['sender'])
        # Ensure roles alternate correctly (user, model, user, model...)
        # If roles are consecutive, it's an issue with the history data structure
        if history_for_model and history_for_model[-1]['role'] == role:
            # This indicates a history structure issue. Add a placeholder or log error.
            print(f"Warning: Consecutive roles in history for chat_api: {role}")
            # Simple fix: treat consecutive user messages as one turn, or insert dummy model turn
            # For now, let's just log and potentially the API handles it gracefully or errors.
            pass # Gemini API might handle consecutive user turns by combining them

        history_for_model.append({'role': role, 'parts': [{'text': msg['text']}]})


    # The actual system instruction for the *non-Live* model should ideally be set here
    # or when the model is instantiated, depending on the API version/model capabilities.
    # For gemini-1.5-flash-latest, system_instruction is a parameter to GenerativeModel.
    try:
        # Use the regular (sync) GenerativeModel for this old text endpoint
        # Pass system instruction here
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest", # Use a non-Live model for text
            system_instruction=character['system_instruction'] # Use the character's instruction
        )

        # Start chat with the composed history
        chat = model.start_chat(history=history_for_model)

        # Send only the last user message
        user_message_text = messages[-1]['text'] if messages else ""
        if not user_message_text.strip(): # Prevent sending empty last message
             return jsonify({'reply': "..."}) # Or some default response


        response = chat.send_message(user_message_text)

        # Check response structure and get text
        reply = "..."
        if response and response.candidates and response.candidates[0].content and response.candidates[0].content.parts:
             # Concatenate text parts if multiple exist
             reply = "".join(part.text for part in response.candidates[0].content.parts if part.text)

        return jsonify({'reply': reply})

    except Exception as e:
        # Log the error for debugging server-side
        print(f"Error in old text chat endpoint: {e}")
        # Return a JSON error response
        return jsonify({'reply': f"Error processing message: {str(e)}"}), 500


# --- Chat History Endpoints (Assuming these were standard Flask routes) ---
# You'll need to add these back based on your actual implementation
# if they are not using SocketIO. They would typically fetch from a database.

# Example Placeholder for History List
@app.route('/chat/history', methods=['GET'])
def get_chat_history_list():
    # Placeholder: Implement fetching chat history list from your database
    # Example return structure: [{'_id': 'chat123', 'character': 'Sadie', 'startedAt': '...', 'messages': [...]}, ...]
    print("Accessed /chat/history endpoint (placeholder)")
    # You need to replace this with actual database fetching logic
    # For demo, return empty list or mock data
    return jsonify([]) # Or fetch from DB


# Example Placeholder for Chat Detail
@app.route('/chat/history/<chat_id>', methods=['GET'])
def get_chat_detail(chat_id):
    # Placeholder: Implement fetching a specific chat detail from your database by chat_id
    # Example return structure: {'_id': 'chat123', 'character': 'Sadie', 'startedAt': '...', 'messages': [{'sender': 'user', 'text': '...', 'timestamp': '...'}, ...]}
    print(f"Accessed /chat/history/{chat_id} endpoint (placeholder)")
    # You need to replace this with actual database fetching logic
    # For demo, return 404 or mock data
    return jsonify({"message": "Chat history detail not found."}), 404


# --- User Authentication Endpoints (Placeholder) ---
# Assuming you had standard Flask routes for auth, user info, and logout.
# You need to add these back based on your actual implementation.

# Example Placeholder for Google Auth redirect
@app.route('/auth/google', methods=['GET'])
def google_auth():
    # Placeholder: Implement Google OAuth redirect logic
    print("Accessed /auth/google endpoint (placeholder)")
    # Redirect to Google's OAuth consent screen
    # return redirect("...") # Replace with your actual OAuth redirect URL
    return jsonify({"message": "Google auth redirect endpoint (placeholder)"})


# Example Placeholder for User Info
@app.route('/api/user', methods=['GET'])
def get_user():
    # Placeholder: Implement fetching authenticated user info
    print("Accessed /api/user endpoint (placeholder)")
    # Check authentication status (e.g., from session/cookies) and return user data
    # return jsonify({'displayName': 'Test User', 'email': 'test@example.com', 'profilePicture': '...'})
    # or return jsonify({'message': 'Not authenticated'}), 401
    return jsonify({'message': 'Not authenticated'}) # Default unauthenticated placeholder


# Example Placeholder for Logout
@app.route('/api/logout', methods=['GET'])
def logout():
    # Placeholder: Implement logout logic
    print("Accessed /api/logout endpoint (placeholder)")
    # Clear session/cookies and redirect or return success
    # return redirect('/') # Or return jsonify({'message': 'Logged out'})
    return jsonify({'message': 'Logged out'})


# --- Flask Server Entry Point ---
if __name__ == "__main__":
    # import sys # No longer needed
    # Removed the sys.argv[1] == "cli" check
    # This block now always runs the Flask app with SocketIO

    # Note: If you need a separate script for database interactions,
    # keep them outside this main Flask app execution block or put them
    # in functions you call from specific endpoints.

    print("Starting Flask server with SocketIO...")
    # Using allow_unsafe_werkzeug=True is fine for debug=True
    # It's important to use socketio.run() when Flask-SocketIO is involved
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)