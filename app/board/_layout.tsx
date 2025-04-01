// app/board/_layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import CustomBottomBar from "../../components/CustomBottomBar";

export default function BoardLayout() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Slot />
            </View>
            <CustomBottomBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
