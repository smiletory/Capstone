import {StyleSheet} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
      <ThemedView style={styles.Container}>
        <ThemedText type="title" style={styles.Text}>설정</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  Text:{
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});