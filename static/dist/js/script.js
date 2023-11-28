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

const readResponseChunks = async (reader, answerBlock) => {
  const decoder = new TextDecoder();
  const converter = new showdown.Converter();

  let chunks = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks += decoder.decode(value);
    answerBlock.innerHTML = converter.makeHtml(chunks);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#prompt-form');
  const spinnerIcon = document.querySelector('#spinner-icon');
  const sendIcon = document.querySelector('#send-icon');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    spinnerIcon.classList.remove('hidden');
    sendIcon.classList.add('hidden');

    const prompt = form.elements.prompt.value;
    form.elements.prompt.value = '';
    addtoLog(prompt);

    try {
      const answerBlock = addtoLog('GPT est en train de réfléchir ...');
      const reader = await fetchPromptResponse();
      await readResponseChunks(reader, answerBlock);
    } catch (e) {
      console.error('One error has ocurred :', e);
    } finally {
      spinnerIcon.classList.add('hidden');
      sendIcon.classList.remove('hidden');
      hljs.highlightAll();
    }
  });
});
