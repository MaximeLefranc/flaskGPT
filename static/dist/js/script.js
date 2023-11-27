const cloneAnswerBlock = () => {
  const outpout = document.querySelector('#gpt-output');
  const template = document.querySelector('#chat-template');
  const clone = template.cloneNode(true);
  clone.id = '';
  outpout.appendChild(clone);
  clone.classList.remove('hidden');
  return clone.querySelector('.message');
};

const addtoLog = (message) => {
  const answerBlock = cloneAnswerBlock();
  answerBlock.innerText = message;
  return answerBlock;
};

const getChatHistory = () => {
  const messageBlocks = document.querySelectorAll(
    '.message:not(#chat-template .message)'
  );
  return Array.from(messageBlocks).map((element) => element.innerHTML);
};

const fetchPromptResponse = async () => {
  const response = await fetch('/prompt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: getChatHistory(),
    }),
  });

  return response.body.getReader();
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#prompt-form');
  const spinnerIcon = document.querySelector('#spinner-icon');
  const sendIcon = document.querySelector('#send-icon');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    spinnerIcon.classList.remove('hidden');
    sendIcon.classList.add('hidden');
  });
});
