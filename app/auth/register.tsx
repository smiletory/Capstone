
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    Image,
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
    const [confirmPassword, setConfirmPassword] = useState("");
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
            Alert.alert("❌ 이메일 형식 오류", "제주대학교 이메일만 입력 가능합니다.");
            return;
        }

        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(randomCode);
        console.log("📩 생성된 인증코드:", randomCode);

        try {
            await sendVerificationCode(email, randomCode);
            Alert.alert("✅ 인증코드 발송 완료", `${email}로 인증코드가 전송되었습니다.`);
        } catch (error) {
            console.error("❌ 인증코드 전송 실패:", error);
            Alert.alert("❌ 전송 실패", "이메일 전송 중 오류가 발생했습니다.");
        }
    };

    const handleVerifyOrRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("❌ 비밀번호 불일치", "비밀번호가 서로 다릅니다.");
            return;
        }

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
                Alert.alert("이미 가입된 이메일입니다", "로그인 페이지로 이동해주세요.");
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
                Alert.alert("이미 가입된 이메일입니다", "로그인 페이지로 이동해주세요.");
            } else {
                Alert.alert("❌ 회원가입 실패", error.message);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => router.replace("/auth/login")}
                    style={styles.backIcon}
                >
                    <Image
                        source={require("../../assets/icons8-arrow-50.png")}
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>

                <Text style={styles.header}>회원가입</Text>

                <Text style={styles.label}>이메일 *</Text>
                <TextInput
                    placeholder="이메일 앞부분(예: honggildong)"
                    placeholderTextColor="#BDBDBD"
                    value={emailLocal}
                    onChangeText={setEmailLocal}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.comboBox}
                    onPress={() => setShowDomains(!showDomains)}
                >
                    <Text style={styles.comboBoxText}>{emailDomain}</Text>
                    <Image
                        source={require("../../assets/down-arrow.png")}
                        style={styles.arrowIcon}
                    />
                </TouchableOpacity>

                {showDomains && (
                    <View style={styles.dropdown}>
                        {["@stu.jejunu.ac.kr", "@jejunu.ac.kr"].map((domain) => (
                            <TouchableOpacity
                                key={domain}
                                onPress={() => {
                                    setEmailDomain(domain);
                                    setShowDomains(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text>{domain}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}


                        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                            <Text style={styles.buttonText}>인증코드 전송</Text>
                        </TouchableOpacity>

                        <TextInput
                            placeholder="인증코드 입력"
                            placeholderTextColor="#BDBDBD"
                            value={code}
                            onChangeText={setCode}
                            style={styles.input}
                            keyboardType="number-pad"
                        />
                    

                <Text style={styles.label}>비밀번호 *</Text>
                <TextInput
                    placeholder="영문, 숫자 조합 8~16자"
                    placeholderTextColor="#BDBDBD"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <Text style={styles.label}>비밀번호 확인*</Text>
                <TextInput
                    placeholder="비밀번호를 한번 더 입력하세요"
                    placeholderTextColor="#BDBDBD"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleVerifyOrRegister}>
                    <Text style={styles.buttonText}>완료</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    container: {
        width: "100%",
        maxWidth: 400,
        alignSelf: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 40,
        textAlign: "center",
        color: "rgba(0, 0, 0, 0.89)",
    },
    label: {
        fontSize: 20,
        fontWeight: "500",
        color: "rgba(0, 0, 0, 0.89)",
        marginBottom: 5,
        marginTop: 20,
    },
    input: {
        height: 47,
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 10,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    comboBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 47,
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 10,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    comboBoxText: {
        fontSize: 16,
        color: "#000",
    },
    arrowIcon: {
        width: 16,
        height: 16,
        tintColor: "#000",
    },
    dropdown: {
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    button: {
        backgroundColor: "#03A3FD",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#000",
        fontSize: 20,
        fontWeight: "600",
    },
    backIcon: {
        position: "absolute",
        top: 30,
        left: 20,
        zIndex: 1,
    },
});
