import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Link, useRouter } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { latestManga, popularManga } from "../data/mangaData";

export default function MangaList() {
  const router = useRouter();
  const allManga = [...(latestManga || []), ...(popularManga || [])];

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ Back + Title only (no navbar) */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.push("/home")} style={styles.backBtn}>
  <Feather name="arrow-left" size={24} color="#3b82f6" />
</TouchableOpacity>
        <Text style={styles.header}>📚 All Manga</Text>
      </View>

      <FlatList
        data={allManga}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/manga/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Image source={{ uri: item.cover }} style={styles.cover} />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.author && <Text style={styles.meta}>✍️ {item.author}</Text>}
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

  // ✅ Simplified header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
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
