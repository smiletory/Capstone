// /app/board/mypage/favorite.tsx
// 마이페이지 -> 관심목록 화면

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    arrayRemove, 
    query,
    orderBy
} from "firebase/firestore";
import { db } from "../../../constants/firebaseConfig";

interface FavoriteItem {
    id: string;
    title: string;
    description: string;
    image: string;
    addedAt?: any;
}

export default function FavoritesScreen() {
    const router = useRouter();
    const auth = getAuth();
    
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists() || !userDoc.data().favorites) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            // 사용자의 favoriteItems 컬렉션에서 관심 상품 정보 가져오기
            const favoritesCollection = collection(userRef, "favoriteItems");
            const q = query(favoritesCollection, orderBy("addedAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            const favoritesList: FavoriteItem[] = [];
            querySnapshot.forEach((doc) => {
                favoritesList.push({
                    id: doc.id,
                    ...(doc.data() as Omit<FavoriteItem,"id">),
                });
            });

            setFavorites(favoritesList);
        } catch (error) {
            console.error("관심목록을 불러오는데 실패했습니다:", error);
            Alert.alert("오류", "관심목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete =async (itemId: string) => {
    try {
        const user = auth.currentUser;
        if (!user) return;

        await deleteDoc(doc(db, "users", user.uid, "favoriteItems", itemId));
        await updateDoc(doc(db,"users",user.uid),{favorites: arrayRemove(itemId),});

        setFavorites((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
        console.error("삭제 실패:", error);
    }
};

    const handleItemPress = (id: string) => {
        // 상품 상세 페이지로 이동
        router.push(`/board/${id}`);
    };

    const EmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>관심 상품이 없습니다</Text>
            <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => router.push("/board/main")}
            >
                <Text style={styles.browseButtonText}>상품 둘러보기</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>관심목록</Text>
                <TouchableOpacity onPress={fetchFavorites}>
                    <Ionicons name="refresh-outline" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* 로딩 표시 */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2e86de" />
                </View>
            ) : (
                /* 관심상품 리스트 */
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={favorites.length === 0 ? { flex: 1 } : { padding: 16 }}
                    ListEmptyComponent={EmptyList}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            {/* 클릭 가능한 영역 */}
                            <TouchableOpacity
                                style={styles.itemContent}
                                onPress={() => handleItemPress(item.id)}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.image}
                                    defaultSource={require('../../../assets/images/placeholder.png')}
                                />
                                <View style={styles.textBox}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>
                                        {item.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* 삭제 버튼 */}
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#fff" 
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#eee",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        marginTop: 16,
        marginBottom: 24,
    },
    browseButton: {
        backgroundColor: "#2e86de",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    browseButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        paddingVertical: 10,
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 12,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        backgroundColor: "#eee",
    },
    textBox: {
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    description: {
        fontSize: 14,
        color: "#777",
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 4,
    },
});
