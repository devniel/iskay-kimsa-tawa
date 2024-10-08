from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify({"message": "Hello, AI!"})

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/version')
def version():
    return jsonify({"version": "0.1.0"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3003)