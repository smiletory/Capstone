import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

// 바텀 바 전체 컨테이너
export const Container = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding-vertical: 10px;
  border-top-width: 1px;
  border-color: #ddd;
  background-color: #fff;
`;

// 각 탭
export const Tab = styled.TouchableOpacity`
  align-items: center;
  margin-horizontal: 51px;
`;

// 아이콘
export const TabIcon = styled(Ionicons)`
  margin-bottom: 4px;
`;

// 탭 텍스트
export const TabLabel = styled.Text`
  font-size: 16px;
  color: #333;
`;
