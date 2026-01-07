# woorifisa-clova-chatbot

<br>

## 프론트엔드 핵심 코드

<br>

### 1. 비동기 통신 (Async/Await)

- 사용자의 입력부터 서버 응답 처리까지의 전 과정을 `async/await` 문법 적용
- 챗봇의 응답을 기다리는 동안 다른 작업을 있게 처리

```javascript
// /public/app.js
const handleSend = async () => {
    // ...
    
    // 1. 사용자 메시지 즉시 표시 (Optimistic UI)
    addUserMessage(message);
    
    // ...
    
    try {
        // 2. 서버 비동기 요청
        const botResponse = await sendMessage('/chat', message);
        
        // ...
        
        // 3. 응답 도착 시 챗봇 메시지 표시
        addBotMessage(botResponse.replyText);
        
    } catch (error) {
        // 에러 핸들링
    }
}

```

<br>

### 2. 효율적인 DOM 요소 생성 (말풍선 생성 작업)

- 반복되는 DOM 생성을 간소화하기 위해 헬퍼 함수를 구현
- 코드 중복을 줄이고 생산성을 높이기

```javascript
// /public/app.js
// Element 생성 헬퍼 함수
function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.innerText = text;
    return el;
}

// 함수 사용 예시
function addUserMessage(text) {
    const messageRow = createEl('div', 'message-row user');
    const bubbleGroup = createEl('div', 'bubble-group');
    const bubble = createEl('div', 'bubble', text);
    const timestamp = createEl('span', 'timestamp', getCurrentTime());
    bubbleGroup.append(bubble, timestamp);
    messageRow.append(bubbleGroup);
    chatWindow.append(messageRow);
}

```

<br>

## 주요 과제

<br>

### 1. 다양한 입력 방식 지원 (Event Handling)

- 버튼 클릭(`click`)뿐만 아니라 키보드 엔터(`Enter`) 키 입력 시에도 채팅이 전송되도록 처리하여 사용성 개선

```javascript
// /public/app.js
sendButton.addEventListener('click', handleSend); // 버튼 클릭

// 엔터키 입력
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
});

```

<br>

### 2. 안정적인 에러 처리 (Error Handling)

- API 통신 중 발생할 수 있는 예외 상황을 `try-catch` 블록으로 감싸 앱이 비정상 종료되는 것을 방지

```javascript
// /public/api/api.js
export const sendMessage = async (url, userMessage) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: "test-user",
                text: userMessage
            })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('채팅 전송 실패:', error);
        return null;
    }
};

```

<br>

### 3. 중복 전송 방지 (Preventing Duplicate Submissions)

- 비동기 요청이 진행 중일 때(`isSending`)는 추가 실행을 막아, 중복 요청으로 인한 서버 부하 및 UI 오류 방지
- `finally` 구문을 통해 통신 종료 후 상태 초기화

```javascript
// /public/app.js
let isSending = false;

const handleSend = async () => {
    if (isSending) {
        return;
    }

    try {
        // ...
        isSending = true;

        // ...

        addUserMessage(message);

        // ...

        const botResponse = await sendMessage('/chat', message);

        addBotMessage(botResponse.replyText);

        // ...

    } catch (error) {
        // ...
    } finally {
        isSending = false; // 전송 상태 초기화
    }
}

```

<br>

### 4. 사용자 경험(UX) 개선 : Typing Indicator

- 챗봇이 답변을 준비하는 동안 '작성 중'임을 알리는 인디케이터 구현
- 대기 시간 동안 사용자에게 시각적인 피드백을 제공

```javascript
// /public/app.js
let isSending = false;

const handleSend = async () => {
    // ...

    try {

        // ...

        addUserMessage(message);

        // ...

        showTipingIndicator(); // indicator 표시
        await new Promise(resolve => setTimeout(resolve, 1000)); // 응답 대기 (Promise 활용)
    
        const botResponse = await sendMessage('/chat', message);
        addBotMessage(botResponse.replyText);
        removeTypingIndicator(); // 응답 완료 후 indicatior 제거

    } catch (error) {
        // ...
    } finally {
        isSending = false; // 전송 상태 초기화
    }
}
```

<br>

### 5. 자동 스크롤 및 포커스 제어
- Indicator 삽입 시 `scrollTop`을 `scrollHeight`로 설정하여 사용자가 최신 대화 상태를 즉시 확인할 수 있도록 구현

```javascript
// /public/app.js
const showTipingIndicator = () => {
    
    // ... Indicator 생성 및 추가 로직

    chatWindow.appendChild(indicator); // 채팅 영역의 마지막 자식 노드로 추가
    // 콘텐츠 전체 높이(scrollHeight)를 스크롤 위치(scrollTop)에 대입하여 하단 고정
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
