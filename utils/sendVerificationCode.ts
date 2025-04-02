import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_4ngl04f"; // EmailJS 대시보드에서 복사
const TEMPLATE_ID = "capstone-jnu-app_6twc8j5"; // 템플릿 ID
const PUBLIC_KEY = "lkpENEw1YvEpCA3fN"; // EmailJS 계정 > Account > Public Key

export const sendVerificationCode = async (email: string, code: string) => {
    try {
        const result = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            {
                to_email: email,
                code,
            },
            PUBLIC_KEY
        );
        console.log("✅ 인증코드 전송 성공", result.status);
        return result;
    } catch (error) {
        console.error("❌ 인증코드 전송 실패", error);
        throw error;
    }
};
