import React, { useState, useRef, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ImageBackground,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef(null);

  // Button animation
  const scaleButton = useRef(new Animated.Value(1)).current;
  const burstAnim = useRef(new Animated.Value(0)).current;
  const sparkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(sparkAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const validate = () => {
    const tempErrors = {};
    if (!email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Email is invalid";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    return tempErrors;
  };

  const handleLogin = async () => {
    const tempErrors = validate();
    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.replace("/home");
        setEmail("");
        setPassword("");
        Keyboard.dismiss();
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePress = async () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleButton, { toValue: 0.9, duration: 80, useNativeDriver: true }),
        Animated.timing(burstAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scaleButton, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(burstAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
    ]).start();
    await handleLogin();
  };

  const renderInput = (
    iconName,
    placeholder,
    value,
    setValue,
    error,
    ref,
    secure = false,
    nextRef = null,
    onSubmit = null
  ) => (
    <View style={styles.inputGroup}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Feather name={iconName} size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={(text) => setValue(text)}
          onBlur={() => setErrors(validate())}
          style={styles.input}
          secureTextEntry={secure}
          returnKeyType={nextRef ? "next" : "done"}
          onSubmitEditing={() => nextRef?.current?.focus() || onSubmit?.()}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={iconName === "mail" ? "email-address" : "default"}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const formContent = (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        {renderInput("mail", "Email", email, setEmail, errors.email, null, false, passwordRef)}
        {renderInput("lock", "Password", password, setPassword, errors.password, passwordRef, true, null, handlePress)}

        <Animated.View style={{ transform: [{ scale: scaleButton }] }}>
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handlePress}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.burst,
                {
                  transform: [{ scale: burstAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 2] }) }],
                  opacity: burstAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                },
              ]}
            />
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Login</Text>
                <Animated.View
                  style={[
                    styles.spark,
                    {
                      opacity: sparkAnim,
                      transform: [
                        { translateY: sparkAnim.interpolate({ inputRange: [0, 1], outputRange: [-5, -15] }) },
                      ],
                    },
                  ]}
                />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{ uri: "https://m.media-amazon.com/images/I/A1btp-E1m6L.jpg" }}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.6 }}
      >
        <View style={styles.speedLines}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={[styles.line, { top: i * 30, left: -100 + i * 50 }]} />
          ))}
        </View>

        {Platform.OS === "web" ? (
          formContent
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.container}
              keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
              {formContent}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        )}
      </ImageBackground>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  container: { flex: 1 },
  imageBackground: { flex: 1, justifyContent: "center" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    borderWidth: 3,
    borderColor: "#fff",
    zIndex: 2,
  },
  title: { fontSize: 32, fontWeight: "900", color: "#222", textAlign: "center", marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  inputContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fafafa", borderRadius: 12, paddingHorizontal: 12 },
  input: { flex: 1, paddingVertical: 14, paddingLeft: 8, fontSize: 18, color: "#333" },
  inputIcon: { marginRight: 8, color: "#555" },
  inputError: { borderColor: "#ef476f" },
  errorText: { color: "#ef476f", marginTop: 6, fontSize: 13 },
  button: { backgroundColor: "#ff4757", paddingVertical: 16, borderRadius: 30, marginTop: 10, alignItems: "center", borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4, overflow: "visible" },
  buttonText: { color: "#fff", fontWeight: "900", fontSize: 18 },
  spark: { position: "absolute", width: 6, height: 6, backgroundColor: "#fff", borderRadius: 3, top: -10, right: 20 },
  burst: { position: "absolute", width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.2)", top: "50%", left: "50%", marginLeft: -30, marginTop: -30, zIndex: 0 },
  speedLines: { position: "absolute", width: "200%", height: "200%", transform: [{ rotate: "-25deg" }], zIndex: 0 },
  line: { position: "absolute", width: 2, height: 120, backgroundColor: "rgba(255,255,255,0.2)" },
});
