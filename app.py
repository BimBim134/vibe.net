import json
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

def create_app():
    app = Flask(__name__)
    return app

# Function to load existing messages from the JSON file
def load_messages():
    try:
        # Read the content of messages.txt
        with open('messages.json', 'r') as f:
            return  json.load(f)

    except (FileNotFoundError, json.JSONDecodeError):
        return {"messages": []}

# Function to save new messages to the JSON file
def save_messages(messages):
    with open("messages.json", "w") as f:
        json.dump(messages, f, indent=4)

@app.route("/")
def index():
    messages_data = load_messages()
    messages = messages_data["messages"]
    messages = [json.dumps(m) for m in messages]
    return render_template("index.html", messages=messages)

@app.route("/sendMessage", methods=["POST"])
def send_message():
    name = request.form.get("name")
    message = request.form.get("message")
    
    if name and message:
        messages_data = load_messages()
        messages = messages_data["messages"]
        messages.append({"name": name, "message": message})
        save_messages(messages_data)
        
        return jsonify({"name": name, "message": message} ), 200
    else:
        return jsonify({"error": "Name and message are required"}), 400

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
