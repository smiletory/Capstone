import styled from "styled-components/native";

// ��ü �����̳�
export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// �� �ؽ�Ʈ
export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 8px;
`;

// �Ϲ� ��ǲ
export const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
`;

// ��Ƽ���� �ؽ�Ʈ ��ǲ
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

// ī�װ� ����
export const CategoryContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

// ī�װ� ��ư
export const CategoryButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#007bff" : "#e0e0e0")};
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 8px;
`;

// ī�װ� �ؽ�Ʈ
export const CategoryText = styled.Text<{ selected: boolean }>`
  color: ${(props) => (props.selected ? "#fff" : "#333")};
  font-size: 14px;
`;

// �̹��� �̸�����
export const ImagePreview = styled.Image`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-top: 16px;
`;

// ���ε� ��ư
export const UploadButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 20px;
`;

// ���ε� ��ư �ؽ�Ʈ
export const UploadButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
