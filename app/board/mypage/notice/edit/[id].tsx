import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../constants/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function EditNoticeScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchNotice = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, "notices", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setContent(data.content);
                } else {
                    Alert.alert("오류", "공지사항을 찾을 수 없습니다.");
                    router.back();
                }
            } catch (error) {
                console.error("공지 불러오기 실패:", error);
                Alert.alert("오류", "데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotice();
    }, [id]);

    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("입력 오류", "제목과 내용을 모두 입력하세요.");
            return;
        }

        try {
            const docRef = doc(db, "notices", id);
            await updateDoc(docRef, {
                title,
                content,
            });
            Alert.alert("성공", "공지사항이 수정되었습니다.");
            router.replace(`/board/mypage/notice/${id}`);
        } catch (error) {
            console.error("업데이트 실패:", error);
            Alert.alert("오류", "공지사항 수정에 실패했습니다.");
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>공지사항 수정</Text>

            <TextInput
                style={styles.input}
                placeholder="제목"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="내용"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                numberOfLines={10}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>수정 완료</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    textArea: {
        height: 160,
        textAlignVertical: "top",
    },
    button: {
        backgroundColor: "#3498db",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    errorText: {
        marginTop: 40,
        textAlign: "center",
        fontSize: 16,
        color: "red",
    },
});
