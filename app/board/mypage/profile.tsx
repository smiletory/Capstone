// app/board/mypage/profile.tsx
// 마이페이지 -> 프로필 텍스트 클릭 -> 프로필 수정 화면

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Image,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileEdit() {
    const router = useRouter();
    const [nickname, setNickname] = useState("프로필");
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        router.push({
            pathname: "/board/mypage",
            params: {
                nickname,
                imageUri,
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* 뒤로가기 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>프로필 수정</Text>
            </View>

            {/* 이미지 선택 */}
            <TouchableOpacity onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={{ color: "#888" }}>이미지 선택</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* 닉네임 입력 */}
            <TextInput
                style={styles.input}
                placeholder="닉네임 입력"
                value={nickname}
                onChangeText={setNickname}
            />

            <Button title="저장하기" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 12,
        marginTop: 20,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: 20,
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
});
