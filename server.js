// 클라이언트 <-> 서버
import express, { json } from 'express';
import { chatbot } from './api.js';
const app = express();
const PORT = 3000;
app.use(express.static('public'))
app.use(json());
app.get('/', (_, response) => response.sendFile('index.html'));
// 챗봇
app.post('/chat', async(request, response) => {
    // userId는 같은 사용자를 구분하기 위한 고유 값
    const {userId, text} = request.body;
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
    // 외부 API 호출
    const raw = await chatbot(payload);
    console.log(raw);
    const result = JSON.parse(raw);
    //챗봇 응답 문자열 추출
    const replyText =
        (result?.bubbles ?? [])
            .find(b => b?.type === "text")
            ?.data?.description ?? "";
    // userId와 답변 데이터
    const data = {
        userId: result?.userId ?? userId,
        replyText: replyText
    }
    // 클라이언트에게 응답 처리
    response.send(data);
});
app.listen(PORT, () => console.log(`Express 서버가 http://localhost:${PORT} 에서 대기중`));