import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOW } from "./global";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const itemSize = width / 2 - 30;

interface CategoryProps {
    selected: boolean;
}

export const Container = styled.View`
    width: 100%;
    height: 100%;
    background-color: ${COLORS.background};
    padding-top: 30px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 10px;
    height: 55px;
    margin-bottom: 10px;
`;

export const Body = styled.View`
    background-color: ${COLORS.background};
`;

export const Logo = styled.Text`
    font-size: 30px;
`;

export const HeaderTitle = styled.Text`
    font-size: 23px;
    font-weight: bold;
`;

export const HeaderIcons = styled.View`
    flex-direction: row;
    gap: 16px;
`;

export const IconButton = styled.TouchableOpacity``;

export const SearchBar = styled.TextInput`
    height: 42px;
    border-width: 1px;
    border-color: ${COLORS.border};
    border-radius: 10px;
    padding: 0 12px;
    margin: 12px 20px;
    background-color: ${COLORS.lightGray};
`;

export const CategoryBar = styled.ScrollView`
    margin-bottom: 5px;
    padding: 0 10px;
    height: 55px;
    background-color: ${COLORS.background};
`;

export const CategoryItem = styled.TouchableOpacity`
    height: 50px;
    padding: 10px 6.5px;
    margin: 0 8px;
    border-bottom-width: 2px;
    ${(props: CategoryProps) => `
        border-color: ${props.selected ? COLORS.primary : "transparent"};
    `}
`;

export const CategoryText = styled.Text`
    font-size: 20px;
    ${(props: CategoryProps) => `
        color: ${props.selected ? COLORS.primary : COLORS.grayText};
        font-weight: ${props.selected ? "bold" : "normal"};
    `}
`;

export const ItemBox = styled.TouchableOpacity`
    width: ${itemSize}px;
    background-color: ${COLORS.lightGray};
    border-radius: 12px;
    padding: 10px;
    margin: 16px;
    ${SHADOW}
`;

export const ItemImage = styled.Image`
    width: 100%;
    height: ${itemSize}px;
    border-radius: 10px;
`;

export const TitleText = styled.Text`
    font-weight: 600;
    font-size: 15px;
    margin-top: 6px;
`;

export const PriceText = styled.Text`
    color: ${COLORS.darkText};
    font-size: 14px;
`;

export const ItemCategory = styled.Text`
    color: ${COLORS.grayText};
    font-size: 12px;
`;

export const FloatingButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 10px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    overflow: hidden;
    ${SHADOW}
`;

export const FloatingGradient = styled(LinearGradient).attrs({
    colors: [COLORS.primary, COLORS.secondary],
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

export const ScrollTopButtonView = styled.View`
    background-color: ${COLORS.background};
`;

export const ScrollTopButton = styled.TouchableOpacity`
    position: absolute;
    left: 47%;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: ${COLORS.border};
    justify-content: center;
    align-items: center;
`;

export const ScrollTopText = styled.Text`
    color: white;
    font-size: 16px;
`;

export const FavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
