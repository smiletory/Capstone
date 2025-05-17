import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { COLORS, SHADOW } from "./global";

const { width } = Dimensions.get("window");
const itemSize = width / 2 - 30;

interface CategoryProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.softWhite};
  padding-top: 30px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
`;

export const Logo = styled.Text`
  font-size: 32px;
`;

export const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${COLORS.primary};
`;

export const HeaderIcons = styled.View`
  flex-direction: row;
  gap: 14px;
`;

export const IconButton = styled.TouchableOpacity``;

export const SearchBar = styled.TextInput`
  height: 44px;
  border-radius: 12px;
  padding: 0 14px;
  margin: 12px 20px;
  border: 1px solid ${COLORS.border};
  background-color: ${COLORS.lightGray};
`;

export const CategoryBar = styled.ScrollView`
  padding: 0 12px;
  height: 55px;
  background-color: ${COLORS.softWhite};
`;

export const CategoryItem = styled.TouchableOpacity`
  height: 48px;
  padding: 10px 10px;
  margin-right: 8px;
  border-bottom-width: 2px;
  ${(props: CategoryProps) => `
    border-color: ${props.selected ? COLORS.primary : "transparent"};
  `}
`;

export const CategoryText = styled.Text`
  font-size: 18px;
  ${(props: CategoryProps) => `
    color: ${props.selected ? COLORS.primary : COLORS.grayText};
    font-weight: ${props.selected ? "bold" : "500"};
  `}
`;

export const Body = styled.View`
  background-color: ${COLORS.softWhite};
`;

export const ItemBox = styled.TouchableOpacity`
  width: ${itemSize}px;
  background-color: ${COLORS.lightGray};
  border-radius: 16px;
  padding: 12px;
  margin: 14px 10px;
  ${SHADOW}
`;

export const ItemImage = styled.Image`
  width: 100%;
  height: ${itemSize}px;
  border-radius: 12px;
`;

export const TitleText = styled.Text`
  font-weight: 600;
  font-size: 15px;
  margin-top: 6px;
`;

export const PriceText = styled.Text`
  font-size: 14px;
  color: ${COLORS.darkText};
`;

export const ItemCategory = styled.Text`
  font-size: 12px;
  color: ${COLORS.grayText};
`;

export const FloatingButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
  ${SHADOW}
`;

export const FloatingGradient = styled(LinearGradient).attrs({
  colors: [COLORS.primary, COLORS.accent],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const FloatingIcon = styled.Text`
  font-size: 30px;
  color: white;
  font-weight: bold;
`;

export const ScrollTopButton = styled.TouchableOpacity`
  position: absolute;
  left: 50%;
  margin-left: -15px;
  bottom: 90px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: ${COLORS.primary};
  justify-content: center;
  align-items: center;
`;

export const ScrollTopText = styled.Text`
  color: white;
  font-size: 16px;
`;
