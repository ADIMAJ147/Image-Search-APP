import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { convertToMarkdown } from '../api/client';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/html',
  'text/csv',
  'text/plain',
  'application/json',
];

export default function HomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleFile = async (uri: string, name: string, mimeType: string) => {
    setLoading(true);
    setStatus('Converting…');
    try {
      const markdown = await convertToMarkdown(uri, name, mimeType);
      navigation.navigate('Result', { markdown, filename: name });
    } catch (e) {
      Alert.alert('Error', (e as Error).message ?? 'Conversion failed');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: DOCUMENT_TYPES,
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, name, mimeType } = result.assets[0];
      await handleFile(uri, name, mimeType ?? 'application/octet-stream');
    }
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to convert images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, fileName, mimeType } = result.assets[0];
      await handleFile(uri, fileName ?? 'image.jpg', mimeType ?? 'image/jpeg');
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to capture documents.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled && result.assets[0]) {
      await handleFile(result.assets[0].uri, 'capture.jpg', 'image/jpeg');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Convert documents & images to Markdown</Text>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#6c63ff" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : (
          <>
            <PickerButton
              icon="📄"
              label="Pick a Document"
              sub="PDF, Word, Excel, PowerPoint, HTML…"
              onPress={pickDocument}
            />
            <PickerButton
              icon="🖼️"
              label="Pick an Image"
              sub="Extract text via OCR"
              onPress={pickImage}
            />
            <PickerButton
              icon="📷"
              label="Take a Photo"
              sub="Capture & convert on the spot"
              onPress={takePhoto}
            />
          </>
        )}

        <View style={styles.formatsBox}>
          <Text style={styles.formatsTitle}>Supported formats</Text>
          <Text style={styles.formatsText}>
            PDF · Word · Excel · PowerPoint · HTML · CSV · JSON · Images
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PickerButton({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: string;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  content: { padding: 24, gap: 16 },
  subtitle: { color: '#a0a0c0', fontSize: 15, marginBottom: 8, textAlign: 'center' },
  loadingBox: { alignItems: 'center', paddingVertical: 48, gap: 16 },
  statusText: { color: '#a0a0c0', fontSize: 14 },
  card: {
    backgroundColor: '#1e1e32',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#2e2e48',
  },
  cardIcon: { fontSize: 32 },
  cardLabel: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
  cardSub: { color: '#7070a0', fontSize: 13, marginTop: 2 },
  formatsBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  formatsTitle: { color: '#6c63ff', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  formatsText: { color: '#6060a0', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
