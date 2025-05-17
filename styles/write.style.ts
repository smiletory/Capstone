import styled from "styled-components/native";

// 전체 컨테이너
export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// 라벨 텍스트
export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 8px;
`;

// 일반 인풋
export const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
`;

// 멀티라인 텍스트 인풋
export const TextArea = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  height: 120px;
  color: #333;
  text-align-vertical: top;
`;

// 카테고리 영역
export const CategoryContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

// 카테고리 버튼
export const CategoryButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#007bff" : "#e0e0e0")};
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 8px;
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
`;

// 업로드 버튼
export const UploadButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;

// 업로드 버튼 텍스트
export const UploadButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
