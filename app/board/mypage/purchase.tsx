// app/board/mypage/purchase.tsx
// 마이페이지 -> 구매내역 화면


// app/board/mypage/purchase.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PurchaseHistoryScreen() {
  const router = useRouter();

  const items = [
    {
      id: "1",
      title: "무선 마우스",
      description: "전자기기 / 새상품",
      image: "https://via.placeholder.com/60",
      date: "2025.04.05",
    },
    {
      id: "2",
      title: "노트북 파우치",
      description: "파우치 / 중고",
      image: "https://via.placeholder.com/60",
      date: "2025.03.30",
    },
    {
      id: "3",
      title: "핸드폰 거치대",
      description: "거치용 / 새상품",
      image: "https://via.placeholder.com/60",
      date: "2025.03.28",
    },
  ];

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>구매내역</Text>
      </View>

      {/* 리스트 */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* 왼쪽 클릭 가능한 영역 */}
            <TouchableOpacity
              style={styles.infoArea}
              onPress={() => console.log("구매 항목 클릭:", item.title)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textBox}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
            </TouchableOpacity>

            {/* 오른쪽 날짜 (비터치 영역) */}
            <View style={styles.dateArea}>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#eee",
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
    paddingVertical: 16,
  },
  infoArea: {
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
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemDesc: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  dateArea: {
    width: 80,
    alignItems: "flex-end",
  },
  itemDate: {
    fontSize: 12,
    color: "#999",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
