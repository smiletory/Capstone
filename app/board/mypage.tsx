// app/board/mypage.tsx
// 마이페이지 메인 화면

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function MyPageScreen() {
  const router = useRouter();
  const { nickname, imageUri } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      {/* 상단 프로필 영역 */}
      <View style={styles.profileContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri as string }
              : require("../../assets/images/favicon.png")
          }
          style={styles.profileImage}
        />

        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={() => router.push("/board/mypage/profile")}>
            <Text style={styles.profileName}>
              {nickname ? nickname : "프로필"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.logout}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 설정창 메뉴 */}
      <View style={styles.menuList}>
        <MenuItem label="개인정보 및 계정" onPress={() => router.push("/board/mypage/account/account")} />
        <MenuItem label="관심목록" onPress={() => router.push("/board/mypage/favorite")} />
        <MenuItem label="판매내역" onPress={() => router.push("/board/mypage/sales")} />
        <MenuItem label="구매내역" onPress={() => router.push("/board/mypage/purchase")} />
        <MenuItem label="공지사항" onPress={() => router.push("/board/mypage/notice")} />
        <MenuItem label="앱설정" onPress={() => router.push("/board/mypage/settings/setting")} />
      </View>
    </ScrollView>
  );
}

function MenuItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.menuItem}>
        <Text style={styles.menuText}>{label}</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#eee",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
  },
  logout: {
    fontSize: 12,
    color: "#888",
    position: "absolute",
    top: 0,
    right: 0,
  },
  menuList: {
    padding: 16,
    backgroundColor: "#fff",
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 5,
  },
  menuText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});
