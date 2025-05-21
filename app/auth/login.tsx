import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
            const userCredential = await signInWithEmailAndPassword(
                auth,
                trimmedEmail,
                trimmedPassword
            );
            Alert.alert(
                "로그인 성공",
                `${userCredential.user.email}님 환영합니다!`
            );
            router.replace("../board/main");
        } catch (error: any) {
            console.log("❌ 로그인 실패:", error);

            let message = "알 수 없는 오류가 발생했습니다.";

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

            Alert.alert("로그인 실패", message);
        }
    };

    const goToRegister = () => {
        router.push("./register");
    };

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/in_symbol.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>하영 마켓</Text>
            <Text style={styles.subtitle}>LOG IN</Text>

            {/* 이메일 입력과 도메인 선택 */}
            <View style={styles.row}>
                <TextInput
                    style={[styles.input, styles.inputHalf]}
                    placeholder="이메일"
                    value={emailLocal}
                    onChangeText={setEmailLocal}
                />
                <TouchableOpacity
                    style={[styles.comboBox, styles.inputHalf]}
                    onPress={() => setShowDomains(!showDomains)}
                >
                    <Text style={styles.comboBoxText}>{emailDomain}</Text>
                    <Image
                        source={require("../../assets/down-arrow.png")}
                        style={styles.arrowIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* 드롭다운 */}
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

            {/* 비밀번호 */}
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* 버튼 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={goToRegister}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 150,
        marginBottom: 10,
    },
    title: {
        fontFamily: "Jua",
        fontSize: 40,
        marginBottom: 10,
        color: "#000",
    },
    subtitle: {
        fontFamily: "Jua",
        fontSize: 28,
        marginBottom: 30,
        color: "#000",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginBottom: 15,
    },
    input: {
        width: "90%",
        height: 55,
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        fontSize: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 15,
    },
    inputHalf: {
        width: "48%",
        marginBottom: 0,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 10,
    },
    button: {
        flex: 1,
        backgroundColor: "#03A3FD",
        paddingVertical: 14,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
    },
    dropdown: {
        backgroundColor: "#f9f9f9",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        width: "90%",
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    comboBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 55,
        borderColor: "#BDBDBD",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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
});
