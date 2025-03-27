import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Platform,
} from "react-native";
import { sendVerificationCode } from "../../utils/sendVerificationCode";
import {
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "../../constants/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const [emailLocal, setEmailLocal] = useState("");
    const [emailDomain, setEmailDomain] = useState("@stu.jejunu.ac.kr");
    const [showDomains, setShowDomains] = useState(false);
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const router = useRouter();

    const email = `${emailLocal}${emailDomain}`;

    const handleSendCode = async () => {
        if (
            !emailLocal ||
            !(
                email.endsWith("@stu.jejunu.ac.kr") ||
                email.endsWith("@jejunu.ac.kr")
            )
        ) {
            Alert.alert(
                "❌ 이메일 형식 오류",
                "제주대학교 이메일만 입력 가능합니다."
            );
            return;
        }

        const randomCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        setGeneratedCode(randomCode);
        console.log("📩 생성된 인증코드:", randomCode);

        try {
            await sendVerificationCode(email, randomCode);
            Alert.alert(
                "✅ 인증코드 발송 완료",
                `${email}로 인증코드가 전송되었습니다.`
            );
        } catch (error) {
            console.error("❌ 인증코드 전송 실패:", error);
            Alert.alert("❌ 전송 실패", "이메일 전송 중 오류가 발생했습니다.");
        }
    };

    const handleVerifyOrRegister = async () => {
        if (Platform.OS === "web") {
            if (code !== generatedCode) {
                Alert.alert("❌ 인증 실패", "인증코드가 일치하지 않습니다.");
                return;
            }
        }

        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (
                signInMethods.length > 0 &&
                signInMethods.includes("password")
            ) {
                console.log("⚠️ 이미 가입된 이메일입니다:", email);
                Alert.alert(
                    "이미 가입된 이메일입니다",
                    "로그인 페이지로 이동해주세요."
                );
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                createdAt: new Date().toISOString(),
            });

            console.log("🎉 회원가입 완료:", userCredential.user.email);
            console.log("✅ router.replace 실행됨");

            if (Platform.OS === "web") {
                router.replace("./board/main");
            } else {
                Alert.alert("🎉 회원가입 성공", "회원가입이 완료되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("../board/main"),
                    },
                ]);
            }
        } catch (error: any) {
            console.error("❌ 회원가입 실패:", error);
            if (error.code === "auth/email-already-in-use") {
                Alert.alert(
                    "이미 가입된 이메일입니다",
                    "로그인 페이지로 이동해주세요."
                );
            } else {
                Alert.alert("❌ 회원가입 실패", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>

            <TextInput
                placeholder="이메일 앞부분 (예: honggildong)"
                value={emailLocal}
                onChangeText={setEmailLocal}
                autoCapitalize="none"
                style={styles.input}
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
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            {/* 웹일 때만 인증코드 전송 */}
            {Platform.OS === "web" && (
                <>
                    <Button title="인증코드 전송" onPress={handleSendCode} />
                    <TextInput
                        placeholder="인증코드 입력"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        style={styles.input}
                    />
                </>
            )}

            <Button
                title={
                    Platform.OS === "web" ? "인증 확인 및 회원가입" : "회원가입"
                }
                onPress={handleVerifyOrRegister}
            />

            <TouchableOpacity
                onPress={() => router.replace("/auth/login")}
                style={styles.backButton}
            >
                <Text style={styles.backButtonText}>← 로그인으로 돌아가기</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    backButton: {
        marginTop: 20,
        alignItems: "center",
    },
    backButtonText: {
        color: "#007AFF",
        fontSize: 16,
    },
    domainOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
});
