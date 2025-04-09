// app/board/mypage/setting.tsx

import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AppSettingScreen() {
    const router = useRouter();

    const [doNotDisturb, setDoNotDisturb] = useState(false);
    const [startTime, setStartTime] = useState(new Date(2023, 1, 1, 10, 0));
    const [endTime, setEndTime] = useState(new Date(2023, 1, 1, 23, 0));

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>앱설정</Text>
            </View>

            {/* 알림음 설정 */}
            <TouchableOpacity
                style={styles.settingRow}
                onPress={() =>
                    router.push("/board/mypage/settings/notifications")
                }
            >
                <Text style={styles.settingLabel}>알림음 설정</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* 방해금지 설정 */}
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>방해금지 시간 설정</Text>
                <Switch
                    value={doNotDisturb}
                    onValueChange={setDoNotDisturb}
                    trackColor={{ false: "#ccc", true: "#f66" }}
                    thumbColor="#fff"
                />
            </View>
            <View style={styles.separator} />

            {/* 시간 설정 (ON일 때만) */}
            {doNotDisturb && (
                <>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <Text style={styles.settingLabel}>시작시간</Text>
                        <Text style={styles.settingValue}>
                            {startTime.getHours()}:
                            {startTime.getMinutes().toString().padStart(2, "0")}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />

                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <Text style={styles.settingLabel}>종료시간</Text>
                        <Text style={styles.settingValue}>
                            {endTime.getHours()}:
                            {endTime.getMinutes().toString().padStart(2, "0")}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                </>
            )}

            {/* 시간 선택 팝업 */}
            {showStartPicker && (
                <DateTimePicker
                    mode="time"
                    value={startTime}
                    onChange={(e, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) setStartTime(selectedDate);
                    }}
                />
            )}
            {showEndPicker && (
                <DateTimePicker
                    mode="time"
                    value={endTime}
                    onChange={(e, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) setEndTime(selectedDate);
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eee",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 12,
    },

    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },

    settingLabel: {
        fontSize: 16,
        color: "#000",
    },

    settingValue: {
        fontSize: 16,
        color: "#f66",
    },

    separator: {
        height: 1,
        backgroundColor: "#eee",
        marginLeft: 20,
    },
});
