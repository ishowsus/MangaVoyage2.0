// app/manga/[id].jsx
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Same dummy data
const latestManga = [
  {
    id: "1",
    title: "One Piece Adventure",
    author: "Eiichiro Oda",
    chapter: "Ch. 215",
    time: "2h ago",
    cover:
      "https://attackofthefanboy.com/wp-content/uploads/2023/06/One-Piece.jpg",
  },
  {
    id: "2",
    title: "Naruto",
    author: "Kishimoto",
    chapter: "Ch. 521",
    time: "202d ago",
    cover:
      "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421579757/naruto-vol-70-9781421579757_hr.jpg",
  },
  {
    id: "3",
    title: "Attack on Titan",
    author: "Hajime Isayama",
    chapter: "Ch. 42",
    time: "1d ago",
    cover:
      "https://tse3.mm.bing.net/th/id/OIP.CJKDTKWVlElOrJaNNQKp9wHaI7",
  },
];

const popularManga = [
  {
    id: "1",
    title: "One Piece Adventure",
    chapters: "1025 Chapters",
    views: "10.2M Views",
    cover:
      "https://attackofthefanboy.com/wp-content/uploads/2023/06/One-Piece.jpg",
    rank: "#1",
  },
  {
    id: "2",
    title: "Solo Leveling",
    chapters: "700 Chapters",
    views: "8.7M Views",
    cover:
      "https://static.wikia.nocookie.net/solo-leveling/images/b/b4/Solo_Leveling_Side_Stories.jpg/revision/latest?cb=20230131125111",
    rank: "#2",
  },
  {
    id: "3",
    title: "Ragnarok",
    chapters: "139 Chapters",
    views: "7.5M Views",
    cover:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPXm2Evqjqr27MregXhVn9Rmhq08t1YfPZlw&s",
    rank: "#3",
  },
];

export default function MangaDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const allManga = [...latestManga, ...popularManga];
  const manga = allManga.find((item) => item.id === id);

  if (!manga) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "#555" }}>Manga not found ❌</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={22} color="#3b82f6" />
          <Text style={{ color: "#3b82f6", marginLeft: 6 }}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
        <Feather name="arrow-left" size={24} color="#3b82f6" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Cover */}
      <Image source={{ uri: manga.cover }} style={styles.cover} />

      {/* Info */}
      <Text style={styles.title}>{manga.title}</Text>
      {manga.author && <Text style={styles.meta}>✍️ {manga.author}</Text>}
      {manga.chapter && <Text style={styles.meta}>{manga.chapter}</Text>}
      {manga.chapters && <Text style={styles.meta}>{manga.chapters}</Text>}
      {manga.views && <Text style={styles.meta}>{manga.views}</Text>}
      {manga.time && <Text style={styles.meta}>⏰ {manga.time}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  backText: { marginLeft: 6, color: "#3b82f6", fontSize: 16 },
  cover: { width: 220, height: 300, borderRadius: 12, marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  meta: { fontSize: 16, color: "#555", marginBottom: 6 },
  backBtn: { flexDirection: "row", alignItems: "center", marginTop: 16 },
});
