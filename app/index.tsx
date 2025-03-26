import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../constants/firebaseConfig";
import { useRouter } from "expo-router";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // ✅ 로그인 상태 → 메인 페이지로 이동
                router.replace("./main");
            } else {
                // ❌ 로그인 안 됨 → 로그인 페이지로 이동
                router.replace("./auth/login");
            }
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => unsubscribe();
    }, []);

    // 로딩 표시 (잠깐 보일 수 있음)
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
}
