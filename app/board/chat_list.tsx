// app/board/chat_list.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";
import { getAuth } from "firebase/auth";

export default function ChatListScreen() {
    const router = useRouter();
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = getAuth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "chats"),
            where("participants", "array-contains", currentUser.uid),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const fetched = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const chat = {
                        id: docSnap.id,
                        ...docSnap.data(),
                    } as {
                        id: string;
                        postId?: string;
                        postTitle?: string;
                        participants?: string[];
                        lastMessage?: string;
                        updatedAt?: any;
                        unreadCount?: number;
                        warningText?: string;
                    };

                    let title = "알 수 없음";
                    try {
                        if (chat.postId) {
                            const postRef = doc(db, "items", chat.postId);
                            const postSnap = await getDoc(postRef);
                            if (postSnap.exists()) {
                                title = postSnap.data().title;
                            } else {
                                chat.warningText = "게시글이 삭제되었습니다.";
                            }
                        } else {
                            chat.warningText =
                                "채팅방 정보가 존재하지 않습니다.";
                        }
                    } catch {
                        chat.warningText = "채팅방 정보가 존재하지 않습니다.";
                    }

                    const msgQuery = query(
                        collection(db, "chats", chat.id, "messages"),
                        where("read", "==", false),
                        where("senderId", "!=", currentUser.uid)
                    );

                    try {
                        const unreadSnap = await getDocs(msgQuery);
                        chat.unreadCount = unreadSnap.size;
                    } catch {
                        chat.unreadCount = 0;
                    }

                    if (chat.participants?.length === 1) {
                        chat.warningText = "상대방이 채팅방을 나갔습니다.";
                    }

                    chat.postTitle = title;
                    return chat;
                })
            );

            setChats(fetched);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleLeaveChat = async (chatId: string) => {
        if (!currentUser) return;

        Alert.alert("채팅 나가기", "정말 나가시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "나가기",
                style: "destructive",
                onPress: async () => {
                    const chatRef = doc(db, "chats", chatId);
                    await updateDoc(chatRef, {
                        participants: chats
                            .find((chat) => chat.id === chatId)
                            ?.participants?.filter(
                                (uid: string) => uid !== currentUser.uid
                            ),
                        updatedAt: serverTimestamp(),
                    });
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>채팅</Text>

            {chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>텅</Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.chatItemWrapper,
                                Number(item.unreadCount) > 0 &&
                                    styles.unreadBackground,
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => router.push(`./chat/${item.id}`)}
                                onLongPress={() => handleLeaveChat(item.id)}
                                style={styles.chatItem}
                            >
                                <View style={styles.chatHeader}>
                                    <Text style={styles.name}>
                                        {item.postTitle}
                                    </Text>
                                    {Number(item.unreadCount) > 0 && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newText}>
                                                New
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {item.warningText && (
                                    <Text style={styles.noticeText}>
                                        {item.warningText}
                                    </Text>
                                )}
                                <Text style={styles.message}>
                                    {item.lastMessage || "메시지 없음"}
                                </Text>
                                {item.updatedAt?.toDate && (
                                    <Text style={styles.timestamp}>
                                        {item.updatedAt
                                            .toDate()
                                            .toLocaleString("ko-KR")}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    chatItemWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    chatItem: {
        padding: 12,
    },
    unreadBackground: {
        backgroundColor: "#D0E7FF",
    },
    chatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    newBadge: {
        backgroundColor: "#FF3B30",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    newText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    message: {
        color: "#555",
        marginTop: 4,
    },
    timestamp: {
        color: "#999",
        fontSize: 12,
        marginTop: 2,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noticeText: {
        color: "#FF3B30",
        fontWeight: "bold",
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#999",
    },
});
