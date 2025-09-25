// app/home.jsx
import { Link } from "expo-router";
import React from "react";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const { width } = Dimensions.get("window");

// Dummy data
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

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Navbar */}
        <View style={styles.navbar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="book-open" size={24} color="#3b82f6" />
            <Text style={styles.navTitle}>MangaVoyage</Text>
          </View>

          <View style={styles.navRight}>
            <TextInput
              placeholder="Search manga..."
              style={styles.searchInput}
            />
            <Link href="/profile" asChild>
              <TouchableOpacity style={styles.loginBtn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Profile
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Discover Your Next Manga Adventure
          </Text>
          <Text style={styles.heroSubtitle}>
            Explore thousands of manga titles from various genres and authors
            worldwide
          </Text>
        </View>

        {/* Latest Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
          </View>
          <FlatList
            data={latestManga}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 16,
            }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Link href={`/manga/${item.id}`} asChild>
                <TouchableOpacity style={styles.mangaCard}>
                  <Image
                    source={{ uri: item.cover }}
                    style={styles.mangaCover}
                  />
                  <View style={styles.chapterBadge}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.chapter}
                    </Text>
                  </View>
                  <Text style={styles.mangaTitle}>{item.title}</Text>
                  <View style={styles.mangaMeta}>
                    <Text style={styles.mangaAuthor}>{item.author}</Text>
                    <Text style={styles.mangaTime}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
        </View>

        {/* Popular Manga */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Manga</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularManga.map((item) => (
              <Link href={`/manga/${item.id}`} key={item.id} asChild>
                <TouchableOpacity style={styles.popularCard}>
                  <Image
                    source={{ uri: item.cover }}
                    style={styles.popularCover}
                  />
                  <View style={styles.rankBadge}>
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.rank}
                    </Text>
                  </View>
                  <Text style={styles.popularTitle}>{item.title}</Text>
                  <Text style={styles.popularMeta}>{item.chapters}</Text>
                  <Text style={styles.popularMeta}>{item.views}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  navTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 8 },
  navRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  searchInput: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    width: 180,
  },
  loginBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  hero: {
    backgroundColor: "#3b82f6",
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  mangaCard: {
    width: (width - 48) / 2,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 8,
    elevation: 2,
  },
  mangaCover: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  chapterBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mangaTitle: { fontWeight: "bold", fontSize: 14, marginTop: 4 },
  mangaMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  mangaAuthor: { fontSize: 12, color: "#6b7280" },
  mangaTime: { fontSize: 12, color: "#6b7280" },
  popularCard: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  popularCover: { width: "100%", height: 140 },
  rankBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#facc15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  popularTitle: { fontWeight: "bold", fontSize: 14, marginTop: 4 },
  popularMeta: { fontSize: 12, color: "#6b7280" },
});
