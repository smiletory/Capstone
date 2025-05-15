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
import { db } from "../../../../constants/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function WriteNoticeScreen() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert("제목을 입력해주세요.");
            return;
        }
        if (!content.trim()) {
            Alert.alert("내용을 입력해주세요.");
            return;
        }

        try {
            await addDoc(collection(db, "notices"), {
                title,
                content,
                createdAt: serverTimestamp(),
            });
            Alert.alert("공지사항이 등록되었습니다.");
            router.replace("/board/mypage/notice/notice");
        } catch (error) {
            console.error("공지 등록 실패:", error);
            Alert.alert("공지 등록에 실패했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>공지사항 작성</Text>
            </View>

            {/* 입력 폼 */}
            <View style={styles.form}>
                <Text style={styles.label}>제목</Text>
                <TextInput
                    style={styles.input}
                    placeholder="공지 제목을 입력하세요"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>내용</Text>
                <TextInput
                    style={[styles.input, styles.textarea]}
                    placeholder="공지 내용을 입력하세요"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>등록하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 15,
    },
    textarea: {
        height: 120,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
