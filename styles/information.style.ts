import styled from "styled-components/native";

// ��ü ��ũ�� ����
export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 40,
  },
})`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

// �ε� �� ���� �޽��� �߾� ����
export const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

// ��ǰ �̹���
export const ProductImage = styled.Image`
  width: 100%;
  height: 280px;
  border-radius: 12px;
  margin-bottom: 16px;
`;

// ��ǰ ����
export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
`;

// ����
export const Price = styled.Text`
  font-size: 18px;
  color: #333;
  margin-bottom: 4px;
`;

// ī�װ�
export const Category = styled.Text`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

// ����
export const Description = styled.Text`
  font-size: 16px;
  line-height: 22px;
  color: #444;
  margin-bottom: 20px;
`;

// ���� �׼� ��ư (����, ����, ä��)
export const ActionButton = styled.TouchableOpacity<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  padding: 14px;
  border-radius: 10px;
  margin-top: 10px;
  align-items: center;
`;

// ���� �׼� ��ư �ؽ�Ʈ
export const ActionButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

// �÷��� �ڷΰ��� ��ư (elevation�� ���)
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
