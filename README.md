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
```


<br>
<br>

## 백엔드 핵심 코드

### 전체 동작 흐름
1. 클라이언트는 { userId, text } 형태의 JSON을 `/chat` 엔드포인트로 전송

2. server.js는 해당 요청을 Chatbot API가 요구하는 포맷(payload)으로 변환하여 외부 Chatbot API 호출

3. api.js는 Secret Key를 이용해 요청 서명(Signature)을 생성한 뒤, Chatbot API를 호출하고, 챗봇 응답을 반환

5. server.js는 응답을 파싱하여 챗봇이 생성한 텍스트만 추출한 후 클라이언트에 전달


<br>

### 1. server.js (클라이언트와 서버 통신)


#### API 스펙: `POST /chat`
- Request Body
```JSON
{
    "userId": "string", 
    "text": "string" 
}
```
- Response Body
```JSON
{
    "userId": "string", 
    "replyText": "string"
}
```

<br>

#### 핵심 로직
- 클라이언트 요청(JSON)을 받아 CLOVA 챗봇 API로 전달
- 챗봇 응답에서 텍스트만 추출해 클라이언트에 반환

```javascript
app.post('/chat', async(request, response) => {
    try{
        // 1. 요청 바디에서 userId, text 추출
        const {userId, text} = request.body;
    
        // 2. CLOVA Chatbot API가 요구하는 payload 생성
        const payload = {
            "version": "v2",
            userId,
            userIp: request.ip || "127.0.0.1",
            "timestamp": Date.now(),
            "bubbles": [ 
                {
                    "type": "text",
                    "data" : { 
                        "description" : text
                    } 
                } 
            ],
            "event": "send"
        };
    
        // 3. 외부 API(chatbot) 호출
        const raw = await chatbot(payload);
        
        // 4. 문자열(JSON) 응답을 JS 객체로 변환
        const result = JSON.parse(raw);
    
        // 5. 챗봇 응답 객체에서 text 타입 bubble의 description을 추출
        const replyText =
            (result?.bubbles ?? [])
                .find(b => b?.type === "text")
                ?.data?.description ?? "";
    
    
        // 6. 응답 데이터 구성
        const data = {
            userId: result?.userId ?? userId,
            replyText: replyText
        }
    
        response.send(data);

    } catch (err) {
        // ...
    }


});
```

<br>

### 2. api.js(서버와 챗봇 통신)

- server.js에서 전달받은 payload를 Chatbot API 요청 형식으로 변환
- 요청 본문을 기반으로 서명(Signature) 생성 후, 서명 헤더를 포함하여 Chatbot API 호출
- 챗봇 응답을 server.js에 반환

<br>

```javascript
// .env에서 SECRET_KEY, CHATBOT_URL 가져오기
const SECRET_KEY = process.env.SECRET_KEY;
const CHATBOT_URL = process.env.CHATBOT_URL;


export async function chatbot(payload) {
    try{
        // 1. 요청 바디를 문자열로 변환
        const requestBodyString = JSON.stringify(payload);
    
        // 2. 요청 바디(JSON 문자열)를 Secret Key로 HMAC-SHA256 → Base64 인코딩
        const signature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(requestBodyString, "utf8")
            .digest("base64");

        // 3. CLOVA Chatbot API 호출
        const result = await HTTP
                        .post(CHATBOT_URL) 
                        .set('Content-Type', 'application/json; charset=UTF-8') 
                        .set('X-NCP-CHATBOT_SIGNATURE', signature) 
                        .send(requestBodyString); 
    
        // 4. 응답(JSON 문자열) 반환
        return result.text;

    } catch(err) {
        // ...
    }

}

```