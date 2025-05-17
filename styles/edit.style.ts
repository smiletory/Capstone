import styled from "styled-components/native";

// ��ũ�� ������ ��ü �����̳� + �ϴ� ���� Ȯ��
export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 80, // �ϴ� ��ư�� �߸��� �ʵ��� ���� ���� Ȯ��
  },
})`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// ��
export const Label = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 20px;
  margin-bottom: 8px;
`;

// �Ϲ� ��ǲ �ʵ�
export const Input = styled.TextInput`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
`;

// ���� �Է� (��Ƽ����)
export const TextArea = styled(Input)`
  height: 120px;
  text-align-vertical: top;
`;

// ī�װ� ��ư���� ���δ� ����
export const CategoryContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

// ī�װ� ��ư
export const CategoryButton = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${(props) => (props.selected ? "#007aff" : "#e0e0e0")};
  padding: 8px 16px;
  border-radius: 20px;
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
  margin-bottom: 16px;
`;

// ���ε� �� ���� ��ư
export const StyledButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? "#999" : "#007aff")};
  padding: 14px;
  border-radius: 10px;
  align-items: center;
  margin-top: 16px;
`;

// ��ư �ؽ�Ʈ
export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
