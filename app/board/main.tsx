// app/board/main.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  Keyboard,
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
]
const numColumns = 2;

export default function MainScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollOffsetRef = useRef(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [isScrollTracking, setIsScrollTracking] = useState(true);
  const scrollTimeoutRef = useRef<any>(null); 


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

  // 애니메이션 관련 상태
  const searchBarHeight = useRef(new Animated.Value(0)).current;

  // SearchBar 펼치기 애니메이션
  useEffect(() => {
    if (showSearchBar) {
        // SearchBar가 보일 때, 높이를 60으로 늘림 (원하는 높이로 설정)
        Animated.timing(searchBarHeight, {
        toValue: 60,
        duration: 300, // 애니메이션 시간
        useNativeDriver: false,
        }).start();
    } else {
        // SearchBar가 사라질 때, 높이를 0으로 줄임
        Animated.timing(searchBarHeight, {
        toValue: 0,
        duration: 300, // 애니메이션 시간
        useNativeDriver: false,
        }).start();
    }
    }, [showSearchBar, searchBarHeight]);

// onScroll 이벤트에서 스크롤 방향을 감지하여 버튼을 표시하거나 숨깁니다.
const handleScroll = (e) => {
  if (!isScrollTracking) return; // 스크롤 추적이 비활성화된 경우, 추적하지 않음

  const currentOffsetY = e.nativeEvent.contentOffset.y; // 현재 Y축 스크롤 위치
  const delta = Math.abs(currentOffsetY - scrollOffsetRef.current); // 이전 위치와 현재 위치 차이

  const threshold = 10; // 임계값 (예: 10px 이상 변화했을 때만 반응)

  // 스크롤 변화량이 임계값 이상일 경우에만 처리
  if (delta > threshold) {
    // 스크롤이 위로 가면 버튼 표시
    if (currentOffsetY < scrollOffsetRef.current) {
      setShowScrollTopButton(true);
    } else {
      setShowScrollTopButton(false);
    }

    // 스크롤이 멈췄을 때 1초 후에 버튼을 숨깁니다.
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current); // 기존 타이머 취소
    }

    // 1초 후에 버튼을 숨기는 타이머 설정
    scrollTimeoutRef.current = setTimeout(() => {
      setShowScrollTopButton(false);
    }, 1000);

    // 현재 스크롤 위치를 ref에 저장
    scrollOffsetRef.current = currentOffsetY;
    }
  };

  const scrollTopButtonPosition = useRef(new Animated.Value(0)).current; // 버튼의 초기 위치는 화면 밖
  
  useEffect(() => {
    if (showScrollTopButton) {
      // 이미 버튼이 화면에 있으면 애니메이션 생략
      scrollTopButtonPosition.stopAnimation((currentValue) => {
        if (currentValue === 0) return;
  
        Animated.timing(scrollTopButtonPosition, {
          toValue: -750,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // 버튼 숨김 애니메이션
      Animated.timing(scrollTopButtonPosition, {
        toValue: -770,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showScrollTopButton]);

  // 스크롤이 멈췄을 때 위치값 초기화
  const handleScrollEnd = () => {
    scrollOffsetRef.current = 0; // 스크롤이 멈추면 위치값 초기화
  };

  return (
    <Container>
      <Header>
        <Logo>🛍️</Logo>
        <HeaderTitle>하영 마켓</HeaderTitle>
        <HeaderIcons>
          <IconButton>
            <Ionicons name="notifications-outline" size={30} color="black" />
          </IconButton>
          <IconButton onPress={() => {
            setShowSearchBar((prev) => !prev);
            Keyboard.dismiss();
          }}>
            <Ionicons name="search-outline" size={30} color="black" />
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
            <CategoryText selected={selectedCategory === category}>
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
            {item.imageUrl && <ItemImage source={{ uri: item.imageUrl }} />}
            <TitleText numberOfLines={1}>{item.title}</TitleText>
            <PriceText>💰 {item.price?.toLocaleString()}원</PriceText>
            <ItemCategory>📦 {item.category}</ItemCategory>
        </ItemBox>
        )}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        contentContainerStyle={{
            paddingBottom: 120
            }}
      />     
      </Body>
      
        <FloatingButton onPress={() => router.push("/board/write")}>
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
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
              }
            >
              <ScrollTopText>↑</ScrollTopText>
            </ScrollTopButton>
          </Animated.View>
      )}

    </Container>
  );
}
