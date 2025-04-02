// app/board/[id].tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";

export default function DetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchItem = async () => {
            try {
                const docRef = doc(db, "items", String(id));
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem(docSnap.data());
                } else {
                    console.warn("❌ 해당 문서가 존재하지 않습니다");
                }
            } catch (error) {
                console.error("❌ 데이터 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.centered}>
                <Text>물품 정보를 불러올 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {item.imageUrl && (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.image}
                    />
                )}
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>
                    💰 {item.price?.toLocaleString()}원
                </Text>
                <Text style={styles.category}>📦 {item.category}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </ScrollView>

            {/* 👇 왼쪽 하단 고정 뒤로가기 버튼 */}
            <TouchableOpacity
                style={styles.floatingBackButton}
                onPress={() => router.back()}
            >
                <Text style={styles.floatingBackText}>←</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    price: {
        fontSize: 18,
        marginBottom: 6,
    },
    category: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 22,
    },
    floatingBackButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        backgroundColor: "#007AFF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    floatingBackText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
});
