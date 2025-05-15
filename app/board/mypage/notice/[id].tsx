import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../constants/firebaseConfig";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const ADMIN_EMAILS = ["test@stu.jejunu.ac.kr", "admin2@example.com"];

interface NoticeDetail {
    title: string;
    content: string;
    createdAt?: Date;
}

export default function NoticeDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [notice, setNotice] = useState<NoticeDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                if (!id) return;
                const docRef = doc(db, "notices", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNotice({
                        title: data.title,
                        content: data.content,
                        createdAt: data.createdAt?.toDate?.(),
                    });
                } else {
                    console.warn("존재하지 않는 공지입니다.");
                }
            } catch (error) {
                console.error("공지 상세 조회 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotice();

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;

        Alert.alert("공지 삭제", "정말 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "notices", id));
                        alert("삭제되었습니다.");
                        router.back();
                    } catch (error) {
                        console.error("삭제 실패:", error);
                        alert("삭제 중 오류가 발생했습니다.");
                    }
                },
            },
        ]);
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
    }

    if (!notice) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>공지사항을 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>공지 상세</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>{notice.title}</Text>
                <Text style={styles.date}>
                    {notice.createdAt
                        ? moment(notice.createdAt).format("YYYY.MM.DD")
                        : "날짜 없음"}
                </Text>
                <Text style={styles.content}>{notice.content}</Text>

                {isAdmin && (
                    <View style={styles.adminControls}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.push(`/board/mypage/notice/edit/${id}`)}
                        >
                            <Text style={styles.buttonText}>수정</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                        >
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
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
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
    errorText: {
        padding: 20,
        fontSize: 16,
        color: "red",
    },
    adminControls: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 30,
        gap: 12,
    },
    editButton: {
        backgroundColor: "#2980b9",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 6,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
