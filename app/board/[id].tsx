// app/board/[id].tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    doc,
    getDoc,
    deleteDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../../constants/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            try {
                const docRef = doc(db, "items", String(id));
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem(docSnap.data());
                } else {
                    console.warn("❌ 해당 문서가 존재하지 않습니다");
                }
            } catch (error) {
                console.error("❌ 데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleDelete = async () => {
        if (item.authorId !== currentUser?.uid) {
            Alert.alert("권한 없음", "이 글을 삭제할 권한이 없습니다.");
            return;
        }

        Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(db, "items", String(id)));
                        Alert.alert("삭제 완료", "글이 삭제되었습니다.");
                        router.replace("/board/main");
                    } catch (error) {
                        console.error("❌ 삭제 오류:", error);
                        Alert.alert("삭제 실패", "다시 시도해주세요.");
                    }
                },
            },
        ]);
    };

    const handleChat = async () => {
        if (!currentUser || !item || !id) return;

        const chatId = `${id}_${currentUser.uid}_${item.authorId}`;
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
            await setDoc(chatRef, {
                postId: id,
                itemTitle: item.title,
                participants: [currentUser.uid, item.authorId],
                users: [{ uid: currentUser.uid }, { uid: item.authorId }],
                updatedAt: serverTimestamp(),
                lastMessage: "",
            });
        }

        router.push(`/board/chat/${chatId}`);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text>물품 정보를 불러올 수 없습니다.</Text>
            </View>
        );
    }

    const isOwner = item.authorId === currentUser?.uid;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {item.imageUrl && (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                    />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>
                    💰 {item.price?.toLocaleString()}원
                </Text>
                <Text style={styles.category}>📦 {item.category}</Text>
                <Text style={styles.description}>{item.description}</Text>

                {isOwner && (
                    <>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => router.push(`/board/edit/${id}`)}
                        >
                            <Text style={styles.editButtonText}>✏️ 수정</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={handleDelete}
                        >
                            <Text style={styles.deleteButtonText}>🗑️ 삭제</Text>
                        </TouchableOpacity>
                    </>
                )}

                {!isOwner && currentUser && (
                    <TouchableOpacity
                        style={styles.chatButton}
                        onPress={handleChat}
                    >
                        <Text style={styles.chatButtonText}>💬 채팅하기</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingBackButton}
                onPress={() => router.back()}
            >
                <Text style={styles.floatingBackText}>←</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    price: {
        fontSize: 18,
        marginBottom: 6,
    },
    category: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 20,
    },
    floatingBackButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#007AFF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    floatingBackText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: "center",
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#FF3B30",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    chatButton: {
        backgroundColor: "#34C759",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    chatButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
