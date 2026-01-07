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

// 인디케이터 보여주기(응답중 메시지 시작)
const showTipingIndicator = () => {
    // html 태그 js에 표기
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    // indicator 표기(appendChild)
    chatWindow.appendChild(indicator);
    chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤 하단 이동
};

// 인디케이터 제거하기(응답완료)
const removeTypingIndicator = () => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
};

const handleSend = async () => {
    try {
        let url = "https://jsonplaceholder.typicode.com/todos/1"; // 백엔드 연동 후 설정
        const message = userInput.value.trim(); // 겅벡제거
    
        if (message.length == 0) return;
    
        console.log(message);
    
        // 유저 질문 말풍선
        addUserMessage(message);
        
        // 입력창 비우기
        userInput.value = ''; 

        console.log("인디케이터 표기");
        showTipingIndicator(); //todo: typing indicator 삽입
        
        await new Promise(resolve => setTimeout(resolve, 2000)); // 강제 대기

        const botResponse = await sendMessage(url, message);
        console.log(botResponse);

        removeTypingIndicator(); // todo: typing indicatior 제거
        
        // 테스트 api
        const title = botResponse.title;
        addBotMessage(title);
    
    } catch (error) {
        console.error(`오류 발생: ${error}`);
        addBotMessage("오류 발생했습니다.");
    }
}

sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.isComposing) { // 한글 중복 입력 방지
    handleSend();
  }
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('페이지 로드 완료');
    const welcomeMessage = '안녕하세요! 스마트 뱅킹 AI입니다. 무엇을 도와드릴까요?';
    addBotMessage(welcomeMessage, false);
});

