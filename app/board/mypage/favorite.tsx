// /app/board/mypage/favorite.tsx
// 마이페이지 -> 관심목록 화면

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const router = useRouter();

  const [favorites, setFavorites] = useState([
    {
      id: "1",
      title: "무선 이어폰",
      description: "음향기기 / 새상품",
      image: "https://via.placeholder.com/80x80.png?text=상품1",
    },
    {
      id: "2",
      title: "아이패드 케이스",
      description: "태블릿용 / 중고",
      image: "https://via.placeholder.com/80x80.png?text=상품2",
    },
    {
      id: "3",
      title: "노트북 파우치",
      description: "전자기기 / 새상품",
      image: "https://via.placeholder.com/80x80.png?text=상품3",
    },
  ]);

  const handleDelete = (id: string) => {
    Alert.alert("삭제 확인", "이 항목을 관심목록에서 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setFavorites((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>관심목록</Text>
      </View>

      {/* 관심상품 리스트 */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* 클릭 가능한 영역 */}
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => console.log("상품 클릭됨:", item.title)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textBox}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </TouchableOpacity>

            {/* 삭제 버튼 */}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  textBox: {
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 4,
  },
});

