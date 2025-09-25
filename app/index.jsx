import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Animated,
  Image,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const isWeb = Platform.OS === "web";

  const scaleSignUp = useRef(new Animated.Value(1)).current;
  const scaleLogin = useRef(new Animated.Value(1)).current;

  const animateButton = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Floating spark animation
  const sparkAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(sparkAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const backgroundUri = Platform.select({
    web: "https://m.media-amazon.com/images/I/A1btp-E1m6L.jpg",
    default: "https://i.ibb.co/Yd5vK8y/manga-background-mobile.jpg",
  });

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: backgroundUri }} style={styles.background} blurRadius={2} />

      {/* Manga speed lines */}
      <View style={styles.speedLines}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.line,
              {
                top: i * 30,
                left: -100 + i * 50,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.overlay}>
        {/* Action lines behind logo */}
        <View style={styles.actionLines} />

        <Image
          source={{
            uri: "https://thumb.ac-illust.com/eb/eb8d31015f7dbe4a854dd3d22cee1ea0_t.jpeg",
          }}
          style={styles.logoImage}
        />

        <Text style={styles.logo}>MangaVoyage</Text>

        <View style={styles.speechBubble}>
          <Text style={styles.subtitle}>
            Embark on your journey through the world of manga!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="./signup" asChild>
            <Animated.View style={{ transform: [{ scale: scaleSignUp }] }}>
              <TouchableOpacity
                onPress={() => animateButton(scaleSignUp)}
                style={[styles.button, styles.signupButton, styles.comicBorder]}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
                <Animated.View
                  style={[
                    styles.spark,
                    {
                      opacity: sparkAnim,
                      transform: [
                        {
                          translateY: sparkAnim.interpolate({ inputRange: [0, 1], outputRange: [-5, -15] }),
                        },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            </Animated.View>
          </Link>

          <Link href="./login" asChild>
            <Animated.View style={{ transform: [{ scale: scaleLogin }] }}>
              <TouchableOpacity
                onPress={() => animateButton(scaleLogin)}
                style={[styles.button, styles.loginButton, styles.comicBorder]}
              >
                <Text style={styles.buttonText}>Login</Text>
                <Animated.View
                  style={[
                    styles.spark,
                    {
                      opacity: sparkAnim,
                      transform: [
                        {
                          translateY: sparkAnim.interpolate({ inputRange: [0, 1], outputRange: [-5, -15] }),
                        },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            </Animated.View>
          </Link>
        </View>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 20,
  },
  speedLines: {
    position: "absolute",
    width: "200%",
    height: "200%",
    transform: [{ rotate: "-25deg" }],
    zIndex: 0,
  },
  line: {
    position: "absolute",
    width: 2,
    height: 120,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  actionLines: {
    position: "absolute",
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 150,
    zIndex: 1,
    opacity: 0.15,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    zIndex: 2,
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: "#ff2d55",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    fontFamily: Platform.OS === "web" ? "M PLUS Rounded 1c" : "sans-serif",
    zIndex: 2,
  },
  speechBubble: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#000",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    lineHeight: 22,
    fontFamily: Platform.OS === "web" ? "Comic Neue" : "sans-serif",
  },
  buttonContainer: { alignItems: "center", zIndex: 2 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
    overflow: "visible",
  },
  signupButton: { backgroundColor: "#ff4757" },
  loginButton: { backgroundColor: "#1e90ff" },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  comicBorder: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  spark: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 3,
    top: -10,
    right: 20,
  },
});
