import os
from typing import Generator, Sequence
from pprint import pprint

from flask import Flask, render_template, request, Response
import openai
from openai.types.chat.chat_completion_message_param import ChatCompletionMessageParam
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI()

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/prompt', methods=['POST'])
def prompt():
    messages = request.get_json().get('messages')
    conversation = build_conversation_dict(messages)

    return Response(event_stream(conversation), mimetype='text/event-stream')


def build_conversation_dict(messages: list):
    return [
        {
            'role': 'user' if index % 2 == 0 else 'system',
            'content': message
        }
        for index, message in enumerate(messages)
    ]


def event_stream(conversation: list[dict]) -> Generator[str, None, None]:
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=conversation, stream=True)  # type: ignore

    for line in response:
        text = line.choices[0].delta.content
        if text:
            yield text


if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8080)
    # conversation = build_conversation_dict(messages=['Bonjour, comment ça va ?', 'Ça va bien et toi ?'])
    # event_stream(conversation=conversation)
    # for line in event_stream(conversation=conversation):
    #     print(line)
