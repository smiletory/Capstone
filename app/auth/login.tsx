import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../constants/firebaseConfig"; // 경로 확인 필요

const { width } = Dimensions.get("window");

const router = useRouter();

export default function IndexScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        console.log("🟢 로그인 버튼 눌림");
        console.log("auth 객체 확인:", auth);

        try {
            console.log("⏳ 로그인 시도 중...");
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("✅ 로그인 성공:", userCredential.user);

            Alert.alert(
                "로그인 성공",
                `${userCredential.user.email}님 환영합니다!`
            );

            router.replace("../main");
        } catch (error: any) {
            console.log("❌ 로그인 실패");
            console.error(error);
            Alert.alert(
                "로그인 실패",
                error.message || "알 수 없는 오류가 발생했습니다."
            );
        }
    };

    const goToRegister = () => {
        console.log("➡️ 회원가입 페이지로 이동");
        router.push("./register");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔐 로그인</Text>

            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={goToRegister}>
                <Text style={styles.linkText}>계정이 없으신가요? 회원가입</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 100,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        marginBottom: 40,
        fontWeight: "bold",
    },
    input: {
        width: width * 0.8,
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: width * 0.8,
        height: 50,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    linkButton: {
        marginTop: 20,
    },
    linkText: {
        color: "#007AFF",
        fontSize: 16,
    },
});
