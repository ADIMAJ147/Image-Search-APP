import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export default function ResultScreen({ route }: Props) {
  const { markdown, filename } = route.params;
  const [copied, setCopied] = useState(false);

  const baseName = filename.replace(/\.[^/.]+$/, '');

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareFile = async () => {
    const path = `${FileSystem.cacheDirectory}${baseName}.md`;
    await FileSystem.writeAsStringAsync(path, markdown, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Sharing not available', 'Your device does not support sharing.');
      return;
    }
    await Sharing.shareAsync(path, {
      mimeType: 'text/markdown',
      dialogTitle: `Share ${baseName}.md`,
    });
  };

  const wordCount = markdown.trim().split(/\s+/).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <View style={styles.meta}>
          <Text style={styles.filename}>{baseName}.md</Text>
          <Text style={styles.wordCount}>{wordCount} words</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, copied && styles.btnSuccess]}
            onPress={copyToClipboard}
          >
            <Text style={styles.btnText}>{copied ? 'Copied!' : 'Copy'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={shareFile}>
            <Text style={styles.btnText}>Share .md</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.markdown} selectable>
          {markdown}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  toolbar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e48',
    gap: 12,
  },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filename: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  wordCount: { color: '#6060a0', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#2e2e48',
  },
  btnPrimary: { backgroundColor: '#6c63ff' },
  btnSuccess: { backgroundColor: '#22c55e' },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  markdown: {
    color: '#d0d0f0',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});
