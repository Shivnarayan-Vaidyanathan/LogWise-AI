from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Hardcoded credentials
        user_email = "user@example.com"
        user_password = "userpassword"
        
        # Retrieve request data
        data = request.get_json()
        user_mail = data.get("usermail")  # Updated to lowercase key
        password = data.get("password")  # Updated to lowercase key

        # Validate request
        if not user_mail or not password:
            return jsonify({"message": "UserMail and Password are required."}), 400

        # Check if the provided credentials match the hardcoded values
        is_premium = False

        if user_mail == user_email and password == user_password:
            # The user is valid
            pass
        else:
            # Return unauthorized if credentials do not match
            return jsonify({"message": "Invalid credentials."}), 401

        # Return the user's role and whether they are premium
        return jsonify({"message": "Login successful.", "isPremium": is_premium})

    except Exception as ex:
        # Return internal server error if an exception occurs
        return jsonify({"message": f"An error occurred: {str(ex)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)