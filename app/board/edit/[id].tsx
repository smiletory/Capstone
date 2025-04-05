// app/board/edit/[id].tsx
import React, { useEffect, useState } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../constants/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";

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

export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [categoryLoaded, setCategoryLoaded] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            const docRef = doc(db, "items", String(id));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();

                // ✅ 작성자 본인 확인
                const currentUser = auth.currentUser;
                if (!currentUser || data.authorId !== currentUser.uid) {
                    Alert.alert(
                        "권한 오류",
                        "본인이 작성한 글만 수정할 수 있습니다."
                    );
                    router.back();
                    return;
                }

                setTitle(data.title);
                setDescription(data.description);
                setPrice(String(data.price));
                setSelectedCategory(data.category);
                setOriginalImage(data.imageUrl);
                setCategoryLoaded(true);
            } else {
                Alert.alert("오류", "문서를 찾을 수 없습니다.");
            }
        };
        fetchItem();
    }, [id]);

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
            body: JSON.stringify({ image: base64Image, type: "base64" }),
        });
        const data = await response.json();
        if (data.success) return data.data.link;
        else throw new Error("Imgur 업로드 실패");
    };

    const handleUpdate = async () => {
        if (!title.trim())
            return Alert.alert("입력 오류", "제목을 입력해주세요.");
        if (!description.trim())
            return Alert.alert("입력 오류", "설명을 입력해주세요.");
        if (!price.trim() || isNaN(Number(price)))
            return Alert.alert("입력 오류", "가격을 숫자로 입력해주세요.");
        if (!selectedCategory)
            return Alert.alert("입력 오류", "카테고리를 선택해주세요.");

        try {
            setUploading(true);
            let imageUrl = originalImage;
            if (imageUri) imageUrl = await uploadToImgur(imageUri);

            await updateDoc(doc(db, "items", String(id)), {
                title,
                description,
                price: parseInt(price),
                category: selectedCategory,
                imageUrl,
            });

            Alert.alert("수정 완료", "물품이 수정되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.replace(`./board/${id}`),
                },
            ]);
        } catch (error) {
            Alert.alert("오류", "수정 중 문제가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleCategorySelect = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
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
            />

            <Text style={styles.label}>설명</Text>
            <TextInput
                style={[styles.input, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <Text style={styles.label}>가격</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            <Text style={styles.label}>카테고리</Text>
            <View style={styles.categoryContainer}>
                {categoryLoaded &&
                    categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => handleCategorySelect(cat)}
                            style={[
                                styles.categoryButton,
                                selectedCategory === cat &&
                                    styles.selectedCategory,
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

            {(imageUri || originalImage) && (
                <Image
                    source={{
                        uri: imageUri
                            ? `data:image/jpeg;base64,${imageUri}`
                            : originalImage!,
                    }}
                    style={styles.image}
                />
            )}

            <Button
                title={uploading ? "수정 중..." : "수정하기"}
                onPress={handleUpdate}
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
