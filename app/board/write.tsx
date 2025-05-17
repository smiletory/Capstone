import React, { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../constants/firebaseConfig";
import { useRouter } from "expo-router";
import {
  Container,
  Label,
  Input,
  TextArea,
  CategoryContainer,
  CategoryButton,
  CategoryText,
  ImagePreview,
  UploadButton,
  UploadButtonText,
} from "../../styles/write.style";

const categories = [
  "전자제품",
  "노트북",
  "컴퓨터",
  "휴대폰",
  "교재",
  "음식",
  "음료",
  "식권",
  "의류",
  "기타",
];

export default function WriteScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].base64 || null);
    }
  };

  const uploadToImgur = async (base64Image: string) => {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: "Client-ID 5d6ea305ca7904b",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        type: "base64",
      }),
    });

    const data = await response.json();
    if (data.success) return data.data.link;
    else throw new Error("Imgur 업로드 실패");
  };

  const handleUpload = async () => {
    if (!title.trim() || !description.trim() || !price.trim() || !selectedCategory || !imageUri) {
      Alert.alert("입력 오류", "모든 필드를 채워주세요.");
      return;
    }

    if (isNaN(Number(price))) {
      Alert.alert("입력 오류", "가격은 숫자만 입력해주세요.");
      return;
    }

    try {
      setUploading(true);
      const imgurUrl = await uploadToImgur(imageUri);

      await addDoc(collection(db, "items"), {
        title,
        description,
        price: parseInt(price),
        imageUrl: imgurUrl,
        category: selectedCategory,
        status: "selling",
        createdAt: serverTimestamp(),
        authorId: auth.currentUser?.uid,
      });

      Alert.alert("업로드 성공", "물품이 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/board/main"),
        },
      ]);

      setTitle("");
      setDescription("");
      setPrice("");
      setImageUri(null);
      setSelectedCategory(null);
    } catch (error) {
      Alert.alert("오류", "업로드 중 문제가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else if (selectedCategory) {
      Alert.alert("카테고리 선택", "카테고리는 하나만 선택 가능합니다.");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <Container>
      <Label>제목</Label>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="예: 아이폰 13 미개봉"
      />

      <Label>설명</Label>
      <TextArea
        value={description}
        onChangeText={setDescription}
        placeholder="제품 상태, 사용기간 등을 적어주세요."
        multiline
      />

      <Label>가격</Label>
      <Input
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="예: 10000"
      />

      <Label>카테고리</Label>
      <CategoryContainer>
        {categories.map((cat) => (
          <CategoryButton
            key={cat}
            selected={selectedCategory === cat}
            onPress={() => handleCategorySelect(cat)}
          >
            <CategoryText selected={selectedCategory === cat}>
              {cat}
            </CategoryText>
          </CategoryButton>
        ))}
      </CategoryContainer>

      <UploadButton onPress={pickImage}>
        <UploadButtonText>📷 이미지 선택</UploadButtonText>
      </UploadButton>

      {imageUri && (
        <ImagePreview
          source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
        />
      )}

      <UploadButton onPress={handleUpload} disabled={uploading}>
        <UploadButtonText>
          {uploading ? "⏳ 업로드 중..." : "📤 업로드"}
        </UploadButtonText>
      </UploadButton>
    </Container>
  );
}
