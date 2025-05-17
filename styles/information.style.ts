import styled from "styled-components/native";

// 전체 스크롤 영역
export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
})`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// 로딩 및 에러 메시지 중앙 정렬
export const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

// 상품 이미지
export const ProductImage = styled.Image`
  width: 100%;
  height: 280px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

// 상품 제목
export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
`;

// 가격
export const Price = styled.Text`
  font-size: 18px;
  color: #333;
  margin-bottom: 4px;
`;

// 카테고리
export const Category = styled.Text`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

// 설명
export const Description = styled.Text`
  font-size: 16px;
  line-height: 22px;
  color: #444;
  margin-bottom: 20px;
`;

// 공통 액션 버튼 (수정, 삭제, 채팅)
export const ActionButton = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  padding: 14px;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
`;

// 공통 액션 버튼 텍스트
export const ActionButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

// 플로팅 뒤로가기 버튼 (elevation만 사용)
export const FloatingBackButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: #007aff;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;

export const FloatingBackText = styled.Text`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
`;
