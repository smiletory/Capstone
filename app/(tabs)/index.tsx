// 시작: npx expo start

import React, { useState } from 'react';
import {StyleSheet, TextInput, ScrollView, Image, TouchableOpacity} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// 예시 데이터 세트
const items = [
  { id: '1', title: '노트북', price: '300,000원', image: require('../../assets/images/react-logo.png') },
  { id: '2', title: '자전거', price: '150,000원', image: require('../../assets/images/react-logo.png') },
  { id: '3', title: '아이폰', price: '1,000,000원', image: require('../../assets/images/react-logo.png') },
  { id: '4', title: '디지털 카메라', price: '500,000원', image: require('../../assets/images/react-logo.png') },
  { id: '5', title: '스마트 워치', price: '200,000원', image: require('../../assets/images/react-logo.png') },
  { id: '6', title: '헤드폰', price: '150,000원', image: require('../../assets/images/react-logo.png') },
  { id: '7', title: '텔레비전', price: '800,000원', image: require('../../assets/images/react-logo.png') },
  { id: '8', title: '태블릿', price: '350,000원', image: require('../../assets/images/react-logo.png') },
  { id: '9', title: '게임 콘솔', price: '400,000원', image: require('../../assets/images/react-logo.png') },
  { id: '10', title: '전자레인지', price: '120,000원', image: require('../../assets/images/react-logo.png') },
  { id: '11', title: '냉장고', price: '600,000원', image: require('../../assets/images/react-logo.png') },
  { id: '12', title: '세탁기', price: '500,000원', image: require('../../assets/images/react-logo.png') },
  { id: '13', title: '에어컨', price: '1,200,000원', image: require('../../assets/images/react-logo.png') },
  { id: '14', title: '커피 머신', price: '150,000원', image: require('../../assets/images/react-logo.png') },
  { id: '15', title: '프린터', price: '250,000원', image: require('../../assets/images/react-logo.png') },
  { id: '16', title: '스마트폰', price: '800,000원', image: require('../../assets/images/react-logo.png') },
  { id: '17', title: '스피커', price: '130,000원', image: require('../../assets/images/react-logo.png') },
  { id: '18', title: '믹서기', price: '90,000원', image: require('../../assets/images/react-logo.png') },
  { id: '19', title: '책장', price: '100,000원', image: require('../../assets/images/react-logo.png') },
  { id: '20', title: '오디오 시스템', price: '700,000원', image: require('../../assets/images/react-logo.png') },
];

export default function HomeScreen() {
  // 검색창
  const [text, setText] = useState('');
  // 포커스 on / off
  const [isFocused, setIsFocused] = useState(false);

  return (
    // 검색창 + 아이템 리스트 뷰
    <ThemedView style={styles.container}>


      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input, {borderBottomColor: isFocused ? 'blue' : 'gray'}]} // 검색창 눌렀을 때 밑줄 색깔(에시)
          value={text} // 입력 텍스트
          onChangeText={setText} // 텍스트가 바뀔 때마다 업데이트
          onFocus={() => setIsFocused(true)} // 포커스 시
          onBlur={() => setIsFocused(false)} // 포커스 해제 시
          placeholder="검색창" // 기본 텍스트
        />
        <ThemedText style={styles.textStyle}>입력한 값(임시): {text}</ThemedText>
      </ThemedView>


      <ScrollView contentContainerStyle={styles.itemList}>
        {items.map((item) => (
          <TouchableOpacity
            // 데이터 셋에 있는 정보들 불러오기
            key={item.id}
            style={styles.itemContainer}
            // onPress={() => }
            >
            <Image 
              // 이미지 정보 불러오기
              source={item.image}
              style={styles.itemImage} />
            <ThemedView style={styles.itemDetails}>
              <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
              <ThemedText style={styles.itemPrice}>{item.price}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // 전체 프레임
  container:{
    flex: 1,
    paddingTop: 40
  },

  // 검색창 프레임
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // 검색창
  input: {
    width: '70%',
    height: 30,
    fontSize: 18,
    borderWidth: 0, // 기본 테두리 제거
    paddingLeft: 5,
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'gray', // 기본 밑줄 색상
    outlineStyle: 'none',
  },
  textStyle: {
    fontSize: 18,
  },

  // 아이템 리스트 프레임
  itemList: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // 공간이 부족하면 아이템이 아래로 내려가게 설정
    justifyContent: 'space-between',  // 아이템 사이에 균등한 공간 배치
    paddingHorizontal: 10,
  },

  // 각 아이템 프레임
  itemContainer: {
    width: '50%',  // 각 아이템의 너비를 화면의 48%로 설정 (여백을 고려)
    marginBottom: 20,  // 아이템 간의 수직 간격
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    elevation: 5,  // 아이템을 살짝 띄운 효과 (Android)
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // 이미지
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },

  // 타이틀 + 가격 프레임
  itemDetails: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 타이틀
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  // 가격
  itemPrice: {
    fontSize: 16,
    color: 'green',
  },
});