// app/manga/index.jsx
import React from "react";
import { Link, useRouter } from "expo-router";

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Dummy data (same as home)
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
    cover: "https://tse3.mm.bing.net/th/id/OIP.CJKDTKWVlElOrJaNNQKp9wHaI7",
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
      "https://sgimage.netmarble.com/images/netmarble/sololv/20230313/r20w1678676611229.jpg",
    rank: "#2",
  },
  {
    id: "3",
    title: "Ragnarok",
    chapters: "139 Chapters",
    views: "7.5M Views",
    cover:
      "https://tse3.mm.bing.net/th/id/OIP.HLxd70qhrTMGfKhdbYBZrwHaKm",
    rank: "#3",
  },
];

export default function MangaList() {
  const router = useRouter();
  const allManga = [...latestManga, ...popularManga];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.header}>📚 All Manga</Text>
      </View>

      {/* List */}
      <FlatList
        data={allManga}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/manga/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Image source={{ uri: item.cover }} style={styles.cover} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.author && (
                  <Text style={styles.meta}>✍️ {item.author}</Text>
                )}
                {item.chapters && <Text style={styles.meta}>{item.chapters}</Text>}
                {item.views && <Text style={styles.meta}>{item.views}</Text>}
                {item.chapter && <Text style={styles.meta}>{item.chapter}</Text>}
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: { marginRight: 12, padding: 4 },
  header: { fontSize: 22, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  cover: { width: 80, height: 100, borderRadius: 8, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "bold" },
  meta: { fontSize: 13, color: "#555" },
});
