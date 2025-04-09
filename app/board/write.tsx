// app/board/write.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../constants/firebaseConfig";
import { useRouter } from "expo-router";

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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
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
        if (
            !title.trim() ||
            !description.trim() ||
            !price.trim() ||
            !selectedCategory ||
            !imageUri
        ) {
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
                status: "selling", // ✅ 거래 상태 추가
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>제목</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="물품 제목"
            />

            <Text style={styles.label}>설명</Text>
            <TextInput
                style={[styles.input, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                placeholder="물품 설명"
                multiline
            />

            <Text style={styles.label}>가격</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="예: 10000"
            />

            <Text style={styles.label}>카테고리</Text>
            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => handleCategorySelect(cat)}
                        style={[
                            styles.categoryButton,
                            selectedCategory === cat && styles.selectedCategory,
                        ]}
                    >
                        <Text
                            style={{
                                color:
                                    selectedCategory === cat
                                        ? "white"
                                        : "black",
                            }}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Button title="이미지 선택" onPress={pickImage} />

            {imageUri && (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
                    style={styles.image}
                />
            )}

            <Button
                title={uploading ? "업로드 중..." : "업로드"}
                onPress={handleUpload}
                disabled={uploading}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    label: {
        fontWeight: "bold",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    textarea: {
        height: 100,
        textAlignVertical: "top",
    },
    image: {
        width: "100%",
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    categoryButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    selectedCategory: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
});
