// app/board/main.tsx
import React, { useEffect, useState, useRef } from "react";
import {
    Animated,
    FlatList,
    RefreshControl,
    Keyboard,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";

import {
    Container,
    SearchBar,
    CategoryBar,
    CategoryItem,
    CategoryText,
    ItemBox,
    ItemImage,
    TitleText,
    PriceText,
    ItemCategory,
    FloatingButton,
    FloatingGradient,
    FloatingIcon,
    ScrollTopButton,
    ScrollTopText,
    Header,
    Body,
    Logo,
    HeaderTitle,
    HeaderIcons,
    IconButton,
} from "../../styles/main.styles";
import { Ionicons } from "@expo/vector-icons";

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
    "의류",
    "기타",
];
const numColumns = 2;

export default function MainScreen() {
    const [items, setItems] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchText, setSearchText] = useState("");
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const [isScrollTracking, setIsScrollTracking] = useState(true);

    const scrollOffsetRef = useRef(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollTimeoutRef = useRef<any>(null);
    const scrollTopButtonPosition = useRef(new Animated.Value(0)).current;
    const searchBarHeight = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    const fetchData = () => {
        const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(fetched);
            setRefreshing(false);
        });
    };

    useEffect(() => {
        const unsubscribe = fetchData();
        return () => unsubscribe();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: scrollOffsetRef.current,
                    animated: false,
                });
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

    useEffect(() => {
        Animated.timing(searchBarHeight, {
            toValue: showSearchBar ? 60 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [showSearchBar]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!isScrollTracking) return;
        const currentOffsetY = e.nativeEvent.contentOffset.y;
        const delta = Math.abs(currentOffsetY - scrollOffsetRef.current);
        const threshold = 10;

        if (delta > threshold) {
            setShowScrollTopButton(currentOffsetY < scrollOffsetRef.current);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setShowScrollTopButton(false);
            }, 1000);

            scrollOffsetRef.current = currentOffsetY;
        }
    };

    useEffect(() => {
        Animated.timing(scrollTopButtonPosition, {
            toValue: showScrollTopButton ? -750 : -770,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showScrollTopButton]);

    const handleScrollEnd = () => {
        scrollOffsetRef.current = 0;
    };

    return (
        <Container>
            <Header>
                <Logo>🛍️</Logo>
                <HeaderTitle>정들엉</HeaderTitle>
                <HeaderIcons>
                    <IconButton>
                        <Ionicons
                            name="notifications-outline"
                            size={30}
                            color="black"
                        />
                    </IconButton>
                    <IconButton
                        onPress={() => {
                            setShowSearchBar((prev) => !prev);
                            Keyboard.dismiss();
                        }}
                    >
                        <Ionicons
                            name="search-outline"
                            size={30}
                            color="black"
                        />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <Animated.View style={{ height: searchBarHeight }}>
                {showSearchBar && (
                    <SearchBar
                        placeholder="검색어를 입력하세요"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                )}
            </Animated.View>

            <Body>
                <CategoryBar horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category}
                            selected={selectedCategory === category}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <CategoryText
                                selected={selectedCategory === category}
                            >
                                {category}
                            </CategoryText>
                        </CategoryItem>
                    ))}
                </CategoryBar>

                <FlatList
                    ref={flatListRef}
                    data={filteredItems}
                    keyExtractor={(item) => item.id}
                    numColumns={numColumns}
                    onScroll={handleScroll}
                    onMomentumScrollEnd={handleScrollEnd}
                    renderItem={({ item }) => (
                        <ItemBox onPress={() => router.push(`./${item.id}`)}>
                            {item.imageUrl && (
                                <ItemImage source={{ uri: item.imageUrl }} />
                            )}
                            <TitleText numberOfLines={1}>
                                {item.title}
                            </TitleText>
                            <PriceText>
                                💰 {item.price?.toLocaleString()}원
                            </PriceText>
                            <ItemCategory>📦 {item.category}</ItemCategory>
                        </ItemBox>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchData}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
            </Body>

            <FloatingButton onPress={() => router.push("./write")}>
                <FloatingGradient>
                    <FloatingIcon>＋</FloatingIcon>
                </FloatingGradient>
            </FloatingButton>

            {showScrollTopButton && (
                <Animated.View
                    style={{
                        transform: [{ translateY: scrollTopButtonPosition }],
                    }}
                >
                    <ScrollTopButton
                        onPress={() =>
                            flatListRef.current?.scrollToOffset({
                                offset: 0,
                                animated: true,
                            })
                        }
                    >
                        <ScrollTopText>↑</ScrollTopText>
                    </ScrollTopButton>
                </Animated.View>
            )}
        </Container>
    );
}
