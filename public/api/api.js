// 채팅 보내기 함수
export const sendMessage = async (url, userMessage) => {
  try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
            body: JSON.stringify({
                userId: "test-user",
                text: userMessage
            })
        //   JSON.stringify(userMessage)
      }
    );
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('채팅 전송 실패:', error);
      return null;
  }
};