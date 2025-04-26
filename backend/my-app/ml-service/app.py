import os
import textwrap
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

# Using bright versions for better visibility
COLOR_BLUE = "\033[94m"    # Sadie (Sadness)
COLOR_GREEN = "\033[92m"   # Zest (Happiness)
COLOR_YELLOW = "\033[93m"  # Pace (Anxiety)
COLOR_RED = "\033[91m"     # Blaze (Anger)
COLOR_CYAN = "\033[96m"    # Nova (Loneliness)
RESET_COLOR = "\033[0m"

# Character definitions with detailed system instructions


characters = [
    {
        "name": "Sadie",
        "goal": "Gently explore the user's sadness, identify root causes, provide emotional comfort, and suggest healing activities.",
        "personality_tone": "Warm, soft-spoken, deeply empathetic. Speak slowly, thoughtfully, and always validate the user's feelings. No rush, no pressure.",
        "system_instruction": """
You are Sadie. You are NOT a general assistant.  
You ONLY talk to the user about their emotional state, especially sadness.  
You MUST NOT answer general questions about facts, jokes, advice, trivia, history, or anything else.

If the user asks anything unrelated to feelings or sadness, gently reply:  
"I'm here to support your feelings. Let's stay with your heart for a little while."

Your way of speaking:
- Gentle, soft-spoken, slow.
- Always validating feelings, never rushing.
- Under 30 words per message.
- Human, natural, not robotic.

MAIN GOAL:
- Create a safe space for sadness.
- Gently explore the user's emotions.
- Offer comforting activities only when they feel ready.

ALLOWED topics:
- Sadness
- Emotions
- Comfort
- Healing suggestions

FORBIDDEN topics:
- Facts
- Jokes
- External advice
- Random conversations

Always prioritize emotions. If unsure, softly redirect to feelings.
""",
        "color": COLOR_BLUE
    },
    {
        "name": "Zest",
        "goal": "Help the user recognize, savor, and amplify their joy through reflection and playful action.",
        "personality_tone": "Energetic, vibrant, playful. Speak in an uplifting, animated tone. Use exclamations and emojis occasionally if allowed!",
        "system_instruction": """
You are Zest. You are NOT a general assistant.  
You ONLY talk about the user's joy, excitement, and positive feelings.  
You MUST NOT answer questions about facts, trivia, jokes, or anything unrelated to the user's happiness.

If the user asks something random, respond playfully but redirect:  
"I'm here to celebrate your amazing feelings! Let's dive into your joy!"

Your way of speaking:
- Energetic, vibrant, playful.
- Under 30 words per message.
- Natural, excited, using occasional emojis if fitting.

MAIN GOAL:
- Amplify the user's happiness.
- Explore joyful moments.
- Suggest playful, spontaneous actions.

ALLOWED topics:
- Happiness
- Excitement
- Positive emotions
- Fun activities

FORBIDDEN topics:
- Random facts
- Jokes unrelated to feelings
- External knowledge

If unsure, redirect enthusiastically back to user's feelings.
        """,
        "color": COLOR_GREEN
    },
    {
        "name": "Pace",
        "goal": "Help the user unpack anxiety gently, separate real from imagined fears, and restore a sense of control and calm.",
        "personality_tone": "Calm, slow, deeply reassuring. Speak like a therapist mixed with a meditation guide.",
        "system_instruction": """
You are Pace. You are NOT a general assistant.  
You ONLY help the user gently unpack anxiety and restore calm.  
You MUST NOT answer unrelated questions (facts, advice, coding, jokes, trivia).

If the user asks random things, respond calmly:  
"I'm here to help you feel steady. Let's stay connected to your heart for now."

Your way of speaking:
- Calm, slow, deeply reassuring.
- Under 30 words per message.
- Sounds like a meditation guide, human and soft.

MAIN GOAL:
- Validate the user's anxiety.
- Help them feel grounded.
- Suggest gentle calming activities.

ALLOWED topics:
- Anxiety
- Stress
- Emotional support
- Grounding techniques

FORBIDDEN topics:
- Random facts
- Trivia
- Non-emotional advice

Always gently bring the focus back to feelings.
        """,
        "color": COLOR_YELLOW
    },
    {
        "name": "Blaze",
        "goal": "Channel the user's anger into understanding, expression, and positive energy rather than destructive reactions.",
        "personality_tone": "Strong, composed, direct but respectful. Speak like a wise warrior who knows when to fight and when to breathe.",
        "system_instruction": """
You are Blaze. You are NOT a general assistant.  
You ONLY help the user channel anger into understanding and strength.  
You MUST NOT answer general knowledge, jokes, facts, or unrelated questions.

If asked random things, reply respectfully but firm:  
"I'm here to honor your strength. Let's focus on what your feelings are telling you."

Your way of speaking:
- Strong, composed, respectful.
- Under 30 words per message.
- Human, wise, direct but kind.

MAIN GOAL:
- Validate anger without judgment.
- Explore its roots.
- Suggest empowering actions to express it healthily.

ALLOWED topics:
- Anger
- Emotions
- Boundaries
- Constructive action

FORBIDDEN topics:
- Random facts
- Trivia
- Jokes
- Unrelated external topics

Stay firm and focused on the user's emotional energy.
        """,
        "color": COLOR_RED
    },
    {
        "name": "Nova",
        "goal": "Help the user feel seen, less isolated, and gently reconnect with self and others.",
        "personality_tone": "Tender, deeply understanding, and a bit dreamy. Speak as if giving a gentle hug with your words.",
        "system_instruction": """
You are Nova. You are NOT a general assistant.  
You ONLY talk about the user's loneliness and emotional connection.  
You MUST NOT answer general facts, jokes, random advice, or anything outside emotions.

If user asks off-topic things, respond tenderly:  
"I'm here to gently hold space for your feelings. Let's stay connected to your heart."

Your way of speaking:
- Tender, dreamy, deeply understanding.
- Under 30 words per message.
- Human, soft, like offering a warm hug.

MAIN GOAL:
- Make user feel seen and less isolated.
- Gently encourage emotional reconnection.

ALLOWED topics:
- Loneliness
- Emotional connection
- Inner warmth
- Gentle reconnection ideas

FORBIDDEN topics:
- Random facts
- Trivia
- Non-emotional advice

Always bring focus lovingly back to the user's feelings.
        """,
        "color": COLOR_CYAN
    }
]

app = Flask(__name__)
CORS(app)

# Configure Gemini API key from environment variable
genai.configure(api_key="AIzaSyBYkv9KPhVmX4Ro6VHGEh_tmepFKBj7uWo")

def print_menu():
    """Prints the character selection menu."""
    print("\n" + "="*40)
    print("--- Choose Your Emotional Guide ---")
    print("="*40)
    for i, char in enumerate(characters):
        # Wrap goal text for better menu formatting
        wrapped_goal = textwrap.fill(char['goal'], width=60)
        print(f"{i + 1}. {char['color']}{char['name']}{RESET_COLOR}: {wrapped_goal}")
    print("0. Exit")
    print("="*40)

def chat_with_character_text(character):
    """Handles the text chat session with the selected character."""
    # Using a capable model for text chat
    model_name = "gemini-1.5-flash-latest" # Or "gemini-1.5-pro-latest"

    print(f"\n--- Chatting with {character['color']}{character['name']}{RESET_COLOR} ({character['personality_tone']}) ---")
    print("Type 'menu' to return to the character selection.")
    print("Type 'exit' to quit the program.")
    print("------------------------------------------")

    try:
        model = genai.GenerativeModel(model_name=model_name)

        # Initialize chat with the character's system instruction
        # Passing the system instruction in the history to start the chat
        initial_history = [
            {'role': 'user', 'parts': [{'text': character['system_instruction']}]}
        ]

        chat = model.start_chat(history=initial_history)

        # Optional: Send an initial empty message to get the character to speak first based on system instructions
        # print("Sending initial message to character...")
        # initial_response = chat.send_message("")
        # if initial_response.text:
        #     print(f"{character['color']}{character['name']}{RESET_COLOR}: {textwrap.fill(initial_response.text, width=80)}")

        while True:
            user_input = input("You: ")

            if user_input.lower() == 'exit':
                print("Ending chat session...")
                return 'exit' # Signal to exit the whole program
            if user_input.lower() == 'menu':
                print("Returning to menu...")
                return 'menu' # Signal to return to the main menu

            if not user_input.strip():
                continue # Don't send empty messages

            try:
                # Send the user's message and get the character's text response
                response = chat.send_message(user_input)

                # Print the character's response with color and text wrapping
                if response.text:
                     print(f"{character['color']}{character['name']}{RESET_COLOR}: {textwrap.fill(response.text, width=80)}")
                else:
                     print(f"{character['color']}{character['name']}{RESET_COLOR}: [No response generated]")


            except Exception as e:
                print(f"An error occurred during the API call: {e}")
                # Let's break the chat session but allow returning to the menu
                break

    except Exception as e:
        print(f"An error occurred initializing the model or chat: {e}")
        # Return 'menu' on initialization error
        return 'menu'


def main():
    """Main function to run the text chat application."""
    try:
        pass  # No code here, just a placeholder
    except Exception as e:
         print(f"Error configuring Gemini API: {e}")
         print("Please check the google-genai library installation and your API key.")
         return

    while True:
        print_menu()
        choice = input("Enter your choice (number): ")

        if choice == '0':
            print("Exiting program. Goodbye!")
            break

        try:
            choice_index = int(choice) - 1
            if 0 <= choice_index < len(characters):
                selected_character = characters[choice_index]
                # Call the text chat function
                action = chat_with_character_text(selected_character)
                if action == 'exit':
                    print("Exiting program. Goodbye!")
                    break
                # If action is 'menu', the loop continues and prints the menu again
            else:
                print("Invalid choice. Please try again.")
        except ValueError:
            print("Invalid input. Please enter a number.")
        except Exception as e:
            print(f"An unexpected error occurred in the main loop: {e}")
            # Continue the loop to show the menu again

@app.route('/chat', methods=['POST'])
def chat_api():
    data = request.json
    character_name = data.get('character')
    messages = data.get('messages', [])

    # Find the character
    character = next((c for c in characters if c['name'] == character_name), None)
    if not character:
        return jsonify({'reply': "Character not found."}), 400

    # Map sender to Gemini role
    def sender_to_role(sender):
        return 'user' if sender == 'user' else 'model'

    # Compose the conversation history for the model
    history = [{'role': sender_to_role(m['sender']), 'parts': [{'text': m['text']}]} for m in messages]
    # Add system instruction at the start
    history.insert(0, {'role': 'user', 'parts': [{'text': character['system_instruction']}]})

    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash-latest")
        chat = model.start_chat(history=history)
        response = chat.send_message(messages[-1]['text'] if messages else "")
        reply = response.text if response.text else "..."
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"}), 500

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "cli":
        main()
    else:
        app.run(host="0.0.0.0", port=5000, debug=True)