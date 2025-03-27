import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../constants/firebaseConfig";

export default function MainScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert("로그아웃 되었습니다");
            router.replace("../auth/login");
        } catch (error: any) {
            Alert.alert("로그아웃 실패", error.message || "알 수 없는 오류");
            console.error("❌ 로그아웃 에러:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>🎉 여기는 메인 화면입니다!</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>로그아웃</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#ff3b30",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
});
