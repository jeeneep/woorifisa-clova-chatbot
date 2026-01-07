# woorifisa-clova-chatbot

🛠️ 작업 순서 (Workflow)

본 프로젝트는 NCP CLOVA Chatbot API를 활용한 웹 챗봇 구현을 목표로 하며,
Frontend / Backend를 역할 분리하여 병렬적으로 개발합니다.

⸻

1️⃣ 전체 개발 흐름
	1.	GitHub 저장소 clone 및 로컬 환경 설정
	2.	Backend 서버에서 CLOVA Chatbot API 연동
	3.	Frontend에서 채팅 UI 구현
	4.	Frontend ↔ Backend API 연동
	5.	UX 개선 (Typing Indicator, 에러 처리 등)
	6.	통합 테스트 및 발표 준비

⸻

2️⃣ Backend 작업 순서 (Node.js / Express)

목표: API Key를 안전하게 관리하고,
Frontend에서 호출할 수 있는 챗봇 API 서버 구현

Step 1. 서버 기본 세팅
	•	Node.js 프로젝트 초기화
	•	Express 설치
	•	기본 서버 실행 확인

npm init -y
npm install express cors dotenv


⸻

Step 2. 환경 변수 설정
	•	.env 파일 생성
	•	CLOVA Chatbot API 정보 관리
⚠️ API Key는 절대 GitHub에 커밋하지 않음

CLOVA_CHATBOT_API_KEY=xxxx
CLOVA_CHATBOT_API_URL=xxxx


⸻

Step 3. 챗봇 API 엔드포인트 구현
	•	POST /api/chat
	•	요청: 사용자 메시지
	•	처리:
	1.	CLOVA Chatbot API 호출
	2.	응답 데이터 파싱
	3.	프론트엔드로 결과 반환

{
  "reply": "챗봇 응답 메시지"
}


⸻

Step 4. 안정성 처리
	•	CORS 설정
	•	입력값 validation
	•	에러 핸들링 (API 실패, 네트워크 오류 등)

⸻

3️⃣ Frontend 작업 순서 (HTML / CSS / JavaScript)

목표: 모바일 웹뷰 환경에서도 사용 가능한 채팅 UI 및 UX 구현

⸻

Step 1. 채팅 UI 레이아웃 구성
	•	채팅 메시지 영역
	•	입력창 + 전송 버튼
	•	메시지 누적 시 스크롤 가능하도록 구현

⸻

Step 2. 메시지 스타일링
	•	사용자 메시지: 오른쪽 정렬
	•	챗봇 메시지: 왼쪽 정렬
	•	말풍선 형태 UI 적용

⸻

Step 3. 채팅 이벤트 처리
	•	전송 버튼 클릭
	•	Enter 키 입력
	•	입력값 비어 있을 경우 전송 방지

⸻

Step 4. Backend API 연동
	•	fetch를 이용해 /api/chat 호출
	•	서버 응답을 받아 챗봇 메시지 렌더링

⸻

Step 5. UX 개선
	•	중복 전송 방지
	•	응답 대기 중 Typing Indicator 표시
	•	에러 발생 시 사용자에게 안내 메시지 출력

⸻

4️⃣ 통합 및 테스트
	•	Frontend ↔ Backend 정상 통신 확인
	•	연속 대화 시 메시지 누적 테스트
	•	모바일 화면 크기 대응 확인

⸻

5️⃣ 발표 준비
	•	구현 기능 시연
	•	전체 구조 설명 (Frontend / Backend 분리)
	•	API Key 보안 처리 방식 설명
	•	README 기반으로 구현 내용 공유

⸻