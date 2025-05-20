// app/board/main.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Animated,
    FlatList,
    RefreshControl,
    Keyboard,
    NativeSyntheticEvent,
    NativeScrollEvent,
    TouchableOpacity,
} from "react-native";
import { useRouter} from "expo-router";
import { collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../constants/firebaseConfig";
import { getAuth } from "firebase/auth";
import { deleteDoc } from "firebase/firestore"; 

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
    FavoriteButton,
} from "../../styles/main.styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

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
    const [favorites, setFavorites] = useState<string[]>([]);

    const scrollOffsetRef = useRef(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollTimeoutRef = useRef<any>(null);
    const scrollTopButtonPosition = useRef(new Animated.Value(0)).current;
    const searchBarHeight = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const auth = getAuth();

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

    // 사용자의 관심목록 불러오기
    const fetchFavorites = useCallback(async () => {
        if (!auth.currentUser) return;

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists() && userSnap.data().favorites) {
                setFavorites(userSnap.data().favorites);
            } else {
                // 관심목록이 없으면 빈 배열로 초기화
                await setDoc(userRef, { favorites: [] }, { merge: true });
                setFavorites([]);
            }
        } catch (error) {
            console.error("관심목록을 불러오는 중 오류 발생:", error);
        }
    }, [auth.currentUser]);

    useEffect(() => {
        const unsubscribe = fetchData();
        fetchFavorites();
        return () => unsubscribe();
    }, [fetchFavorites]);

    // 관심목록 화면에서 돌아왔을 때도 관심목록 새로고침
    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({
                    offset: scrollOffsetRef.current,
                    animated: false,
                });
            }, 50);
        }, [fetchFavorites])
    );

    // 관심목록 토글 함수
    const toggleFavorite = async (itemId: string, itemData: any) => {
        if (!auth.currentUser) {
            // 로그인 상태가 아니면 로그인 페이지로 이동
            alert("관심목록을 사용하려면 로그인이 필요합니다.");
            router.push("/auth/login");
            return;
        }

        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const favoriteItemRef = doc(db, "users", auth.currentUser.uid, "favoriteItems", itemId);

            if (favorites.includes(itemId)) {
                // 관심목록에서 제거
                await updateDoc(userRef, {
                    favorites: arrayRemove(itemId),
                });
                //여기
                await deleteDoc(favoriteItemRef);
                setFavorites(prev => prev.filter(id => id !== itemId));
            } else {
                // 관심목록에 추가
                await updateDoc(userRef, {
                    favorites: arrayUnion(itemId),
                });

                // 관심목록에 필요한 상품 정보 저장
                await setDoc(favoriteItemRef, {
                    id: itemId,
                    title: itemData.title,
                    description: `${itemData.category} / ${itemData.condition || "상품"}`,
                    image: itemData.imageUrl,
                    addedAt: new Date(),
                });
                
                setFavorites(prev => [...prev, itemId]);
            }
        } catch (error) {
            console.error("관심목록 업데이트 중 오류 발생:", error);
            alert("관심목록 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
    };

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

    const navigateToMyFavorites = () => {
        if (!auth.currentUser) {
            alert("관심목록을 보려면 로그인이 필요합니다.");
            router.push("/auth/login");
            return;
        }
        router.push("./mypage/favorite");
    };

    return (
        <Container>
            <Header>
                <Logo>🛍️</Logo>
                <HeaderTitle>하영 마켓</HeaderTitle>
                <HeaderIcons>
                    <IconButton onPress={navigateToMyFavorites}>
                        <Ionicons
                            name="heart-outline"
                            size={30}
                            color="black"
                        />
                    </IconButton>
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
                        <ItemBox>
                        {/* 관심목록 버튼 (위로 꺼내기) */}
                        <FavoriteButton onPress={() => toggleFavorite(item.id, item)}>
                            <Ionicons
                                name={favorites.includes(item.id) ? "heart" : "heart-outline"}
                                size={24}
                                color={favorites.includes(item.id) ? "#FF6347" : "#888"}
                            />
                        </FavoriteButton>
                    
                        {/* 상품 클릭 영역 */}
                        <TouchableOpacity 
                            style={{ width: "100%", height: "100%" }}
                            onPress={() => router.push(`./${item.id}`)}
                            activeOpacity={0.8}
                        >
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
                        </TouchableOpacity>
                    </ItemBox>
                    
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                fetchData();
                                fetchFavorites();
                            }}
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
