// app/board/chat/[id].tsx
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../../constants/firebaseConfig";
import { getAuth } from "firebase/auth";

export default function ChatRoom() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [chatTitle, setChatTitle] = useState("");
    const [otherUserLeft, setOtherUserLeft] = useState(false);
    const [blockedReason, setBlockedReason] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const currentUserId = getAuth().currentUser?.uid;

    useEffect(() => {
        if (!id) return;

        const chatRef = collection(db, "chats", String(id), "messages");
        const q = query(chatRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(fetched);

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        const fetchChatInfo = async () => {
            if (!id) return;

            try {
                const chatDocRef = doc(db, "chats", String(id));
                const chatDoc = await getDoc(chatDocRef);
                const chatData = chatDoc.data();

                if (chatDoc.exists() && chatData?.postId) {
                    const postDoc = await getDoc(
                        doc(db, "items", chatData.postId)
                    );
                    if (postDoc.exists()) {
                        setChatTitle(postDoc.data().title);
                    } else {
                        setChatTitle("게시글 없음");
                        setBlockedReason(
                            "게시글이 없어 채팅을 보낼 수 없습니다"
                        );
                        return;
                    }

                    const participants = chatData.participants || [];
                    if (!participants.includes(currentUserId)) {
                        setChatTitle("채팅방 정보 없음");
                        setBlockedReason(
                            "채팅방 정보가 없어 채팅을 보낼 수 없습니다"
                        );
                        return;
                    } else if (participants.length === 1) {
                        setOtherUserLeft(true);
                        setBlockedReason(
                            "상대방이 나가 채팅을 보낼 수 없습니다"
                        );
                    }
                } else {
                    setChatTitle("채팅방 정보 없음");
                    setBlockedReason(
                        "채팅방 정보가 없어 채팅을 보낼 수 없습니다"
                    );
                }
            } catch (error) {
                console.error("❌ 제목 불러오기 실패:", error);
                setChatTitle("불러오기 실패");
            }
        };

        fetchChatInfo();
    }, [id]);

    const handleSend = async () => {
        if (!text.trim()) return;

        const chatRef = collection(db, "chats", String(id), "messages");

        await addDoc(chatRef, {
            text,
            senderId: currentUserId,
            createdAt: serverTimestamp(),
        });

        await updateDoc(doc(db, "chats", String(id)), {
            lastMessage: text,
            updatedAt: serverTimestamp(),
        });

        setText("");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    {chatTitle || "로딩 중..."}
                </Text>
            </View>

            {blockedReason && (
                <Text style={styles.noticeText}>{blockedReason}</Text>
            )}

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageBubble,
                            item.senderId === currentUserId
                                ? styles.myMessage
                                : styles.theirMessage,
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageText,
                                item.senderId !== currentUserId && {
                                    color: "#000",
                                },
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ padding: 12 }}
            />

            {!!blockedReason && (
                <View style={styles.leaveContainer}>
                    <TouchableOpacity
                        style={styles.leaveButton}
                        onPress={async () => {
                            const chatRef = doc(db, "chats", String(id));
                            const chatSnap = await getDoc(chatRef);
                            const current = chatSnap.data();

                            if (!currentUserId || !current?.participants)
                                return;

                            const updatedParticipants =
                                current.participants.filter(
                                    (uid: string) => uid !== currentUserId
                                );

                            await updateDoc(chatRef, {
                                participants: updatedParticipants,
                            });

                            router.replace("/board/chat_list");
                        }}
                    >
                        <Text style={styles.leaveButtonText}>
                            채팅방 나가기
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={blockedReason || "메시지를 입력하세요"}
                    style={styles.input}
                    editable={!blockedReason}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        blockedReason && { backgroundColor: "#ccc" },
                    ]}
                    onPress={handleSend}
                    disabled={!!blockedReason}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        전송
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        padding: 15,
        backgroundColor: "#007AFF",
        alignItems: "center",
    },
    headerText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    noticeText: {
        textAlign: "center",
        color: "#FF3B30",
        marginVertical: 8,
        fontWeight: "bold",
    },
    messageBubble: {
        maxWidth: "75%",
        padding: 10,
        marginVertical: 4,
        borderRadius: 10,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#007AFF",
        borderTopRightRadius: 0,
    },
    theirMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#e5e5ea",
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#007AFF",
        borderRadius: 20,
        paddingHorizontal: 15,
        justifyContent: "center",
    },
    leaveContainer: {
        alignItems: "center",
        marginVertical: 16,
    },
    leaveButton: {
        backgroundColor: "#FF3B30",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    leaveButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
