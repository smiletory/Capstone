import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, deleteUser } from "firebase/auth";

export default function AccountScreen() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user?.email) {
            setUserEmail(user.email);
        }
    }, []);

    const handlePasswordChange = () => {
        router.push("/board/mypage/account/password");
    };

    const handleDeleteAccount = () => {
        Alert.alert("계정 탈퇴", "정말로 탈퇴하시겠어요?", [
            { text: "취소", style: "cancel" },
            {
                text: "탈퇴",
                style: "destructive",
                onPress: async () => {
                    try {
                        const auth = getAuth();
                        const user = auth.currentUser;
                        if (user) {
                            await deleteUser(user);
                            Alert.alert("탈퇴 완료", "계정이 삭제되었습니다.");
                            router.replace("/");
                        }
                    } catch (error: any) {
                        if (error.code === "auth/requires-recent-login") {
                            Alert.alert(
                                "탈퇴 실패",
                                "보안을 위해 다시 로그인 후 탈퇴가 가능합니다."
                            );
                        } else {
                            Alert.alert(
                                "오류",
                                "계정 삭제 중 문제가 발생했습니다."
                            );
                        }
                        console.error("❌ 탈퇴 에러:", error);
                    }
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>개인정보 및 계정</Text>
            </View>

            {/* 이메일 정보 */}
            <View style={styles.section}>
                <Text style={styles.label}>이메일</Text>
                <Text style={styles.value}>
                    {userEmail || "이메일을 불러오는 중..."}
                </Text>
            </View>

            <View style={styles.separator} />

            {/* 비밀번호 수정 */}
            <TouchableOpacity
                style={styles.section}
                onPress={handlePasswordChange}
            >
                <Text style={styles.label}>비밀번호 수정</Text>
                <Text style={styles.link}>비밀번호 변경하기</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            {/* 계정 탈퇴 */}
            <TouchableOpacity
                onPress={handleDeleteAccount}
                style={styles.section}
            >
                <Text style={styles.delete}>계정 탈퇴</Text>
            </TouchableOpacity>
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
    section: {
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
    },
    value: {
        fontSize: 15,
        color: "#333",
        marginTop: 4,
    },
    link: {
        fontSize: 15,
        color: "#007AFF",
        marginTop: 4,
    },
    delete: {
        fontSize: 16,
        color: "red",
        fontWeight: "bold",
    },
    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginHorizontal: 16,
    },
});
