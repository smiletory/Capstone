import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    getAuth,
    reauthenticateWithCredential,
    updatePassword,
    EmailAuthProvider,
} from "firebase/auth";

export default function PasswordChangeScreen() {
    const router = useRouter();
    const [currentPw, setCurrentPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const handleChangePassword = async () => {
        console.log("🔐 비밀번호 변경 시도");

        if (!currentPw || !newPw || !confirmPw) {
            Alert.alert("입력 오류", "모든 항목을 입력해주세요.");
            return;
        }

        if (newPw !== confirmPw) {
            Alert.alert("비밀번호 불일치", "새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user || !user.email) {
                console.error("❌ 로그인된 사용자가 없습니다.");
                Alert.alert("오류", "로그인 정보를 불러올 수 없습니다.");
                return;
            }

            console.log("✅ 현재 유저 이메일:", user.email);

            const credential = EmailAuthProvider.credential(
                user.email,
                currentPw
            );

            console.log("✅ 자격 증명 생성 완료");

            await reauthenticateWithCredential(user, credential);
            console.log("✅ 재인증 성공");

            await updatePassword(user, newPw);
            console.log("✅ 비밀번호 업데이트 성공");

            Alert.alert("변경 완료", "비밀번호가 변경되었습니다.");
            router.back();
        } catch (error: any) {
            console.error("❌ 비밀번호 변경 오류:", error);

            if (error.code === "auth/wrong-password") {
                Alert.alert("오류", "현재 비밀번호가 잘못되었습니다.");
            } else if (error.code === "auth/weak-password") {
                Alert.alert("오류", "비밀번호는 최소 6자 이상이어야 합니다.");
            } else if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                    "재로그인 필요",
                    "보안을 위해 다시 로그인 후 시도해주세요."
                );
            } else {
                Alert.alert("오류", "비밀번호 변경 중 문제가 발생했습니다.");
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>비밀번호 변경</Text>
            </View>

            {/* 입력 폼 */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="현재 비밀번호"
                    secureTextEntry
                    value={currentPw}
                    onChangeText={setCurrentPw}
                />
                <TextInput
                    style={styles.input}
                    placeholder="새 비밀번호"
                    secureTextEntry
                    value={newPw}
                    onChangeText={setNewPw}
                />
                <TextInput
                    style={styles.input}
                    placeholder="새 비밀번호 확인"
                    secureTextEntry
                    value={confirmPw}
                    onChangeText={setConfirmPw}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleChangePassword}
                >
                    <Text style={styles.buttonText}>비밀번호 변경</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    form: {
        padding: 20,
        gap: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 12,
        fontSize: 15,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 12,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
