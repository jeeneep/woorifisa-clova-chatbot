// 서버 <-> 챗봇
import HTTP from 'superagent'

import dotenv from 'dotenv';
dotenv.config(); // env 동작을 위한 설정

import crypto from "crypto";
//import HmacSHA256 from "crypto-js/hmac-sha256.js";
//import EncBase64 from "crypto-js/enc-base64.js";

// CLOVA * Chatbot Custom에서 생성한 Secret Key(네이버 클라우드에서 발급)
const SECRET_KEY = process.env.SECRET_KEY;

// CLOVA Chatbot 빌더에서 생성된 API Gateway의 고유 Invoke URL
const CHATBOT_URL = process.env.CHATBOT_URL;


/**
 * Chatbot 외부 API
 */
export async function chatbot(payload) {
    try{
        const requestBodyString = JSON.stringify(payload);
        // console.log("REQUEST BODY STRING:", requestBodyString);
    
        // X-NCP-CHATBOT_SIGNATURE: 요청 바디 문자열(Request body String)을 
        // Secret Key로 HmacSHA256 → Base64 인코딩한 서명 값
        //const signature = HmacSHA256(requestBodyString, SECRET_KEY).toString(EncBase64);
        const signature = crypto
            .createHmac("sha256", SECRET_KEY)
            .update(requestBodyString, "utf8")
            .digest("base64");


        const result = await HTTP
                        .post(CHATBOT_URL) 
                        .set('Content-Type', 'application/json; charset=UTF-8') 
                        .set('X-NCP-CHATBOT_SIGNATURE', signature) 
                        .send(requestBodyString); 
    
        return result.text;
    } catch(err) {
        console.error("CHATBOT 호출 실패:", err.status, err.response?.text);
        throw err;
    }


}