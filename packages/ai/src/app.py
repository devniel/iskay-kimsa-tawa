from flask import Flask, jsonify, request
from flask_cors import CORS
from src.services import falai

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return jsonify({"message": "Hello, AI!"})

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/version')
def version():
    return jsonify({"version": "0.1.0"})

@app.route('/prompt-to-asset', methods=['POST'])
def prompt_to_asset():
    data = request.json
    prompt = data.get('prompt')
    
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        result = falai.prompt_to_asset(prompt)
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3003)