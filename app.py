import os

from flask import Flask, render_template
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


def build_conversation_dict(messages: list) -> list[dict]:
    return [
        {
            'role': 'user' if index % 2 == 0 else 'assistant',
            'content': message
        }
        for index, message in enumerate(messages)
    ]


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080)
