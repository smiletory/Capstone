import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NoticeScreen() {
  const router = useRouter();

  const notices = [
    { id: "1", title: "[공지] 하영 마켓 이용 약관 변경", date: "2025.04.04" },
    { id: "2", title: "[공지] 개인정보처리방침 개정", date: "2025.04.04" },
  ];

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공지사항</Text>
      </View>

      {/* 공지 리스트 */}
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            // 아래에 TouchableOpacity에서 onPress 옵션에는 공지 클릭했을 때 연결할 곳 넣으면 됨
          <TouchableOpacity style={styles.noticeItem} onPress={() => {console.log("공지 클릭됨:", item.id)}}> 
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ padding: 16 }}
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
