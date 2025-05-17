import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../../constants/firebaseConfig";
import {
  Container,
  Centered,
  ProductImage,
  Title,
  Price,
  Category,
  Description,
  FloatingBackButton,
  FloatingBackText,
  ActionButton,
  ActionButtonText,
} from "../../styles/information.style";

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
      <Centered>
        <ActivityIndicator size="large" color="#007AFF" />
      </Centered>
    );
  }

  if (!item) {
    return (
      <Centered>
        <Title>물품 정보를 불러올 수 없습니다.</Title>
      </Centered>
    );
  }

  const isOwner = item.authorId === currentUser?.uid;

  return (
    <>
      <Container>
        {item.imageUrl && <ProductImage source={{ uri: item.imageUrl }} />}

        <Title>{item.title}</Title>
        <Price>💰 {item.price?.toLocaleString()}원</Price>
        <Category>📦 {item.category}</Category>
        <Description>{item.description}</Description>

        {isOwner ? (
          <>
            <ActionButton
              bgColor="#007AFF"
              onPress={() => router.push(`/board/edit/${id}`)}
            >
              <ActionButtonText>✏️ 수정</ActionButtonText>
            </ActionButton>
            <ActionButton bgColor="#FF3B30" onPress={handleDelete}>
              <ActionButtonText>🗑️ 삭제</ActionButtonText>
            </ActionButton>
          </>
        ) : (
          currentUser && (
            <ActionButton bgColor="#34C759" onPress={handleChat}>
              <ActionButtonText>💬 채팅하기</ActionButtonText>
            </ActionButton>
          )
        )}
      </Container>

      <FloatingBackButton onPress={() => router.back()}>
        <FloatingBackText>←</FloatingBackText>
      </FloatingBackButton>
    </>
  );
}
