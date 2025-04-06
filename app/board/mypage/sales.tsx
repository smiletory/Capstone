// app/board/mypage/sales.tsx
// 마이페이지 -> 판매내역 화면

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SalesHistoryScreen() {
  const [activeTab, setActiveTab] = useState<"selling" | "done">("selling");
  const router = useRouter();

  const sellingItems = [
    { id: "1", title: "홍길동전", description: "고전문학 / A급 상태", image: "https://via.placeholder.com/60" },
    { id: "2", title: "해리포터와 불의 잔", description: "소설 / 중고", image: "https://via.placeholder.com/60" },
    { id: "3", title: "화장지 5개", description: "생활용품 / 새상품", image: "https://via.placeholder.com/60" },
    { id: "4", title: "책 받침대", description: "문구류 / 사용감 있음", image: "https://via.placeholder.com/60" },
  ];

  const doneItems = [
    { id: "5", title: "노트북 파우치", description: "전자기기 / 중고", image: "https://via.placeholder.com/60" },
    { id: "6", title: "중고 핸드폰", description: "전자기기 / 정상 작동", image: "https://via.placeholder.com/60" },
    { id: "7", title: "수학 문제집", description: "교육 / 필기 있음", image: "https://via.placeholder.com/60" },
  ];

  const dataToShow = activeTab === "selling" ? sellingItems : doneItems;

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>판매내역</Text>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("selling")}>
          <Text style={[styles.tabText, activeTab === "selling" && styles.activeTab]}>
            판매중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("done")}>
          <Text style={[styles.tabText, activeTab === "done" && styles.activeTab]}>
            거래완료
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabSeparator} />

      {/* 리스트 */}
      <FlatList
        data={dataToShow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              console.log("클릭한 상품:", item.title);
              // 추후 연결 가능: router.push(`/board/product/${item.id}`)
            }}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
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
  tabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 20,
  },
  tabText: {
    fontSize: 16,
    color: "#aaa",
  },
  activeTab: {
    color: "black",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  tabSeparator: {
    height: 1,
    backgroundColor: "#ddd",
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: "#666",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
