// app/board/main.tsx
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";

const categories = [
    "전체",
    "전자제품",
    "노트북",
    "컴퓨터",
    "휴대폰",
    "교재",
    "음식",
    "음료",
    "식권",
];
const numColumns = 2;
const { width } = Dimensions.get("window");
const itemSize = width / numColumns - 30;

export default function MainScreen() {
    const [items, setItems] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const scrollOffsetRef = useRef(0);
    const flatListRef = useRef<FlatList>(null);
    const router = useRouter();

    const fetchData = () => {
        const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(fetched);
            setLoading(false);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        const unsubscribe = fetchData();
        return () => unsubscribe();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                if (flatListRef.current) {
                    flatListRef.current.scrollToOffset({
                        offset: scrollOffsetRef.current,
                        animated: false,
                    });
                }
            }, 50);
        }, [])
    );

    const filteredItems = items.filter((item) => {
        const matchesCategory =
            selectedCategory === "전체" || item.category === selectedCategory;
        const matchesSearch =
            !searchText ||
            item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                ListHeaderComponent={
                    <View>
                        <TextInput
                            style={styles.searchBar}
                            placeholder="검색어를 입력하세요"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                        <View style={styles.categoryContainer}>
                            <FlatList
                                horizontal
                                data={categories}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.categoryButton,
                                            selectedCategory === item &&
                                                styles.categorySelected,
                                        ]}
                                        onPress={() =>
                                            setSelectedCategory(item)
                                        }
                                    >
                                        <Text
                                            style={
                                                selectedCategory === item
                                                    ? { color: "white" }
                                                    : undefined
                                            }
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                }
                data={filteredItems}
                keyExtractor={(item) => item.id}
                numColumns={numColumns}
                onScroll={(e) =>
                    (scrollOffsetRef.current = e.nativeEvent.contentOffset.y)
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.itemBox}
                        onPress={() => router.push(`./${item.id}`)}
                    >
                        {item.imageUrl && (
                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.image}
                            />
                        )}
                        <Text numberOfLines={1} style={styles.titleText}>
                            {item.title}
                        </Text>
                        <Text style={styles.priceText}>
                            💰 {item.price?.toLocaleString()}원
                        </Text>
                        <Text style={styles.categoryText}>
                            📦 {item.category}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.grid}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => router.push("/board/write")}
            >
                <Text style={styles.floatingButtonText}>＋</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.scrollTopButton}
                onPress={() =>
                    flatListRef.current?.scrollToOffset({
                        offset: 0,
                        animated: true,
                    })
                }
            >
                <Text style={styles.scrollTopText}>↑</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    searchBar: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    categoryContainer: {
        marginBottom: 10,
    },
    categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        marginRight: 8,
    },
    categorySelected: {
        backgroundColor: "#007AFF",
        borderColor: "#007AFF",
    },
    grid: {
        gap: 10,
    },
    itemBox: {
        width: itemSize,
        margin: 5,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        overflow: "hidden",
        padding: 6,
    },
    image: {
        width: "100%",
        height: itemSize,
        borderRadius: 8,
    },
    titleText: {
        fontWeight: "bold",
        marginTop: 5,
    },
    priceText: {
        color: "#333",
        fontSize: 14,
    },
    categoryText: {
        color: "#666",
        fontSize: 12,
    },
    floatingButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
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
    floatingButtonText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    scrollTopButton: {
        position: "absolute",
        bottom: 90,
        right: 30,
        backgroundColor: "#ccc",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollTopText: {
        color: "white",
        fontSize: 16,
    },
});
