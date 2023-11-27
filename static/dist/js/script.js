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
