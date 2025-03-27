import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    FlatList,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../constants/firebaseConfig";

const { width } = Dimensions.get("window");

export default function IndexScreen() {
    const [emailLocal, setEmailLocal] = useState("");
    const [emailDomain, setEmailDomain] = useState("@stu.jejunu.ac.kr");
    const [showDomains, setShowDomains] = useState(false);
    const [password, setPassword] = useState("");
    const router = useRouter();

    const email = `${emailLocal}${emailDomain}`;

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        const trimmedEmail = email.trim().toLowerCase().normalize("NFKC");
        const trimmedPassword = password.trim();

        console.log("🟢 로그인 버튼 눌림");
        console.log("📧 입력된 이메일:", `[${trimmedEmail}]`);
        console.log("🔑 입력된 비밀번호:", `[${trimmedPassword}]`);
        console.log(
            "🚨 Firebase에 전달할 이메일:",
            JSON.stringify(trimmedEmail)
        );

        if (!emailLocal) {
            Alert.alert("입력 오류", "이메일을 입력해주세요.");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            Alert.alert("입력 오류", "올바른 이메일 형식을 입력해주세요.");
            return;
        }

        if (!trimmedPassword) {
            Alert.alert("입력 오류", "비밀번호를 입력해주세요.");
            return;
        }

        try {
            console.log("🚀 Firebase 로그인 시도...");
            const userCredential = await signInWithEmailAndPassword(
                auth,
                trimmedEmail,
                trimmedPassword
            );
            console.log("✅ 로그인 성공:", userCredential.user.email);

            Alert.alert(
                "로그인 성공",
                `${userCredential.user.email}님 환영합니다!`
            );
            router.replace("./board/main");
        } catch (error: any) {
            console.log("❌ 로그인 실패:", error);

            let message = "알 수 없는 오류가 발생했습니다.";

            if (
                error.code === "auth/invalid-email" &&
                isValidEmail(trimmedEmail)
            ) {
                message = "가입된 사용자를 찾을 수 없습니다.";
            } else {
                switch (error.code) {
                    case "auth/invalid-email":
                        message = "이메일 형식이 올바르지 않습니다.";
                        break;
                    case "auth/user-not-found":
                        message = "가입된 사용자를 찾을 수 없습니다.";
                        break;
                    case "auth/wrong-password":
                        message = "비밀번호가 일치하지 않습니다.";
                        break;
                    case "auth/invalid-credential":
                        message = "잘못된 이메일 또는 비밀번호입니다.";
                        break;
                }
            }

            Alert.alert("로그인 실패", message);
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
                placeholder="이메일 앞부분 (예: honggildong)"
                value={emailLocal}
                onChangeText={setEmailLocal}
                autoCapitalize="none"
                autoCorrect={false}
            />

            <TouchableOpacity
                onPress={() => setShowDomains(!showDomains)}
                style={styles.input}
            >
                <Text>{emailDomain}</Text>
            </TouchableOpacity>

            {showDomains && (
                <FlatList
                    data={["@stu.jejunu.ac.kr", "@jejunu.ac.kr"]}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.domainOption}
                            onPress={() => {
                                setEmailDomain(item);
                                setShowDomains(false);
                            }}
                        >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCorrect={false}
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
        justifyContent: "center",
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
    domainOption: {
        width: width * 0.8,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
});
