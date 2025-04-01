// components/CustomBottomBar.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// ✅ 타입을 명확히 지정해주면 에러 해결됨
const TABS = [
    { label: "홈", path: "/board/main" },
    { label: "채팅", path: "/board/chat_list" },
    { label: "마이페이지", path: "/board/mypage" },
] as const;

type TabItem = (typeof TABS)[number]; // ✅ 각 아이템 타입 유추

export default function CustomBottomBar() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {TABS.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.tab}
                    onPress={() => router.replace(tab.path)} // 🔥 이제 빨간줄 없어져야 함
                >
                    <Text>{tab.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
    },
    tab: {
        alignItems: "center",
    },
});
