import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { latestManga, popularManga } from "../data/mangaData"; // ✅ correct import

export default function MangaDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // ✅ Merge both arrays safely
  const allManga = (latestManga || []).concat(popularManga || []);
  const manga = allManga.find((m) => m.id === id);

  if (!manga) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Manga not found ❌</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>⬅ Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cover */}
      <Image source={{ uri: manga.cover }} style={styles.cover} />

      {/* Title */}
      <Text style={styles.title}>{manga.title}</Text>

      {/* Author / Meta */}
      {manga.author && <Text style={styles.meta}>✍️ Author: {manga.author}</Text>}
      {manga.chapter && <Text style={styles.meta}>📖 {manga.chapter}</Text>}
      {manga.chapters && <Text style={styles.meta}>📚 {manga.chapters}</Text>}
      {manga.views && <Text style={styles.meta}>👀 {manga.views}</Text>}
      {manga.time && <Text style={styles.meta}>⏱️ {manga.time}</Text>}

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>⬅ Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  cover: { width: "100%", height: 300, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  meta: { fontSize: 16, marginBottom: 4, color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  notFound: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  backBtn: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  backText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
