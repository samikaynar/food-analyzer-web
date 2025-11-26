from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_product():
    try:
        data = request.json
        product_name = data.get('productName', '')
        
        if not product_name:
            return jsonify({'error': 'Product name is required'}), 400

        prompt = f"""
        Analyze this food product for health: {product_name}

        Please give:
        1) Health score from 1 to 10
        2) Main health factors
        3) Health benefits and risks
        4) Healthier alternatives if needed
        5) Overall recommendation

        Keep it simple and clear.
        """

        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {OPENAI_API_KEY}'
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': 300
            }
        )

        if response.status_code == 200:
            result = response.json()
            analysis = result['choices'][0]['message']['content']
            return jsonify({'analysis': analysis})
        else:
            return jsonify({'error': 'OpenAI API error'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)