import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../../constants/firebaseConfig";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import moment from "moment";

interface Notice {
    id: string;
    title: string;
    date: string;
}

const ADMIN_EMAILS = ["test@stu.jejunu.ac.kr", "admin2@example.com"];

export default function NoticeScreen() {
    const router = useRouter();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = () => {
            const auth = getAuth();
            onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const q = query(
                    collection(db, "notices"),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    date: doc.data().createdAt
                        ? moment(doc.data().createdAt.toDate()).format("YYYY.MM.DD")
                        : "날짜 없음",
                }));
                setNotices(data);
            } catch (error) {
                console.error("공지 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>공지사항</Text>

                {isAdmin && (
                    <TouchableOpacity
                        onPress={() => router.push("/board/mypage/notice/notice_write")}
                        style={{ marginLeft: "auto" }}
                    >
                        <Ionicons name="create-outline" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>

            {/* 공지 리스트 */}
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 32 }} />
            ) : (
                <FlatList
                    data={notices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.noticeItem}
                            onPress={() => {
                                router.push(`/board/mypage/notice/${item.id}`);
                            }}
                        >
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
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
    noticeItem: {
        paddingVertical: 16,
    },
    title: {
        fontSize: 16,
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: "#666",
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
    },
});
