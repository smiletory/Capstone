// app/board/mypage/sales.tsx

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../constants/firebaseConfig";

export default function SalesHistoryScreen() {
    const [activeTab, setActiveTab] = useState<"selling" | "done">("selling");
    const [loading, setLoading] = useState(true);
    const [sellingItems, setSellingItems] = useState<any[]>([]);
    const [doneItems, setDoneItems] = useState<any[]>([]);
    const router = useRouter();
    const currentUser = getAuth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const fetchSales = async () => {
            try {
                setLoading(true);
                const itemsRef = collection(db, "items");

                // 판매중 (status === "selling")
                const sellingQuery = query(
                    itemsRef,
                    where("authorId", "==", currentUser.uid),
                    where("status", "==", "selling")
                );
                const sellingSnap = await getDocs(sellingQuery);
                const selling = sellingSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // 거래완료 (status === "done")
                const doneQuery = query(
                    itemsRef,
                    where("authorId", "==", currentUser.uid),
                    where("status", "==", "done")
                );
                const doneSnap = await getDocs(doneQuery);
                const done = doneSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setSellingItems(selling);
                setDoneItems(done);
            } catch (error) {
                console.error("❌ 판매내역 불러오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [currentUser]);

    const dataToShow = activeTab === "selling" ? sellingItems : doneItems;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>판매내역</Text>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab("selling")}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "selling" && styles.activeTab,
                        ]}
                    >
                        판매중
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setActiveTab("done")}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "done" && styles.activeTab,
                        ]}
                    >
                        거래완료
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabSeparator} />

            {loading ? (
                <ActivityIndicator
                    style={{ marginTop: 30 }}
                    size="large"
                    color="#007AFF"
                />
            ) : (
                <FlatList
                    data={dataToShow}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => router.push(`/board/${item.id}`)}
                        >
                            <Image
                                source={{
                                    uri:
                                        item.imageUrl ||
                                        "https://via.placeholder.com/60",
                                }}
                                style={styles.image}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>
                                    {item.title}
                                </Text>
                                <Text style={styles.itemDesc}>
                                    {item.category} /{" "}
                                    {item.description?.slice(0, 20) ?? ""}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                        <View style={styles.itemSeparator} />
                    )}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 12,
                        paddingBottom: 24,
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#eee",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 20,
    },
    tabText: {
        fontSize: 16,
        color: "#aaa",
    },
    activeTab: {
        color: "black",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    tabSeparator: {
        height: 1,
        backgroundColor: "#ddd",
        marginTop: 8,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 16,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    itemDesc: {
        fontSize: 14,
        color: "#666",
    },
    itemSeparator: {
        height: 1,
        backgroundColor: "#eee",
    },
});
