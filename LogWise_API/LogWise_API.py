import google.generativeai as genai
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

# Initialize Google Gemini API client
genai.configure(api_key="AIzaSyCIDgAzvPOMjuKcIfoORrrvX2K38_QoEzg")  # Replace with your actual API key
model = genai.GenerativeModel("gemini-1.5-flash")  # Specify the Gemini model

@app.route('/api/analyze', methods=['POST'])
def analyze_log_data():
    try:
        file_content = request.json.get('file_content')
        parsed_log_data = request.json.get('parsed_log_data')

        if not file_content:
            return jsonify({"error": "No file content provided."}), 400
        
        if len(file_content.strip()) == 0:
            return jsonify({"error": "The uploaded log file is empty."}), 400

        # Check if parsed_log_data has valid log entries
        if not parsed_log_data or len(parsed_log_data) == 0:
            return jsonify({"error": "No valid log entries found in the uploaded file."}), 400

        # Generate descriptions for each error entry
        descriptions = []
        for entry in parsed_log_data:
            # Prepare the prompt to be sent to Gemini API
            prompt = f"Explain this error concisely: {entry['message']}\nDetails: {entry['details']}"
            
            # Use the Gemini model to generate a short explanation (description)
            response = model.generate_content(prompt)
            
            # Extract and store the generated description from Gemini API
            gemini_description = response.text.strip()
            descriptions.append(gemini_description if gemini_description else "No description available.")

        # Return both the log entries and their corresponding descriptions
        return jsonify({
            "log_analysis": parsed_log_data,
            "descriptions": descriptions,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)