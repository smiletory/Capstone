import React from "react";
import { useRouter } from "expo-router";
import { Container, Tab, TabIcon, TabLabel } from "../styles/CustomBottomBarStyles";

const TABS = [
  { label: "채팅", path: "/board/chat_list", icon: "chatbubble" },
  { label: "홈", path: "/board/main", icon: "home" },
  { label: "마이페이지", path: "/board/mypage", icon: "person" },
] as const;

export default function CustomBottomBar() {
  const router = useRouter();

  return (
    <Container>
      {TABS.map((tab, index) => (
        <Tab key={index} onPress={() => router.replace(tab.path)}>
          <TabIcon name={tab.icon} size={30} color="#666" />
          <TabLabel>{tab.label}</TabLabel>
        </Tab>
      ))}
    </Container>
  );
}
