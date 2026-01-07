import { sendMessage } from './api/api.js';

const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

// Element 생성 함수
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.innerText = text;
    return el;
}

function getCurrentTime(){
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${hours}:${minutes}`;
}

function addUserMessage(text) {
    const messageRow = createEl('div', 'message-row user');
    const bubbleGroup = createEl('div', 'bubble-group');
    const bubble = createEl('div', 'bubble', text);
    const timestamp = createEl('span', 'timestamp', getCurrentTime());

    bubbleGroup.append(bubble, timestamp);
    messageRow.append(bubbleGroup);
    chatWindow.append(messageRow);
}

function addBotMessage(text) {
    const profileDiv = createEl('div', 'profile-image', 'AI');
    const messageRow = createEl('div', 'message-row bot');
    const bubbleGroup = createEl('div', 'bubble-group');
    const bubble = createEl('div', 'bubble', text);
    const timestamp = createEl('span', 'timestamp', getCurrentTime());
    
    messageRow.append(profileDiv);
    bubbleGroup.append(bubble, timestamp);
    messageRow.append(bubbleGroup);
    chatWindow.append(messageRow);
}

sendButton.addEventListener('click', () => {
    const message = userInput.value;

    if (message.length == 0) return;

    console.log(message);

    // 유저 질문 말풍선
    addUserMessage(message);

    // 봇 응답 말풍선
    sendMessage(message);

    // 입력창 비우기
    userInput.value = ''; 
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('페이지 로드 완료');
    const welcomeMessage = '안녕하세요! 스마트 뱅킹 AI입니다. 무엇을 도와드릴까요?';
    addBotMessage(welcomeMessage, false);
});