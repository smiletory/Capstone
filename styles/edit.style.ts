import styled from "styled-components/native";

// 스크롤 가능한 전체 컨테이너 + 하단 공간 확보
export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 80, // 하단 버튼이 잘리지 않도록 여유 공간 확보
  },
})`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// 라벨
export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 8px;
`;

// 일반 인풋 필드
export const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
`;

// 설명 입력 (멀티라인)
export const TextArea = styled(Input)`
  height: 120px;
  text-align-vertical: top;
`;

// 카테고리 버튼들을 감싸는 영역
export const CategoryContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

// 카테고리 버튼
export const CategoryButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#007aff" : "#e0e0e0")};
  padding: 8px 16px;
  border-radius: 20px;
`;

// 카테고리 텍스트
export const CategoryText = styled.Text<{ selected: boolean }>`
  color: ${(props) => (props.selected ? "#fff" : "#333")};
  font-size: 14px;
`;

// 이미지 미리보기
export const ImagePreview = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

// 업로드 및 수정 버튼
export const StyledButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? "#999" : "#007aff")};
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 16px;
`;

// 버튼 텍스트
export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
