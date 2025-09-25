import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ImageBackground,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import { useRouter } from "expo-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();
  const storage = getStorage();

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);
  const [bucketList, setBucketList] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);

  const animatedItems = useRef({}).current;

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setPhoto(data.photo || null);
      } else {
        setName(user.displayName || "");
        setPhoto(user.photoURL || null);
      }
    };
    loadProfile();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const listRef = collection(db, "users", user.uid, "bucketList");
    const unsubscribe = onSnapshot(listRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBucketList(items);
      items.forEach((item) => {
        if (!animatedItems[item.id]) animatedItems[item.id] = new Animated.Value(0);
      });
    });
    return unsubscribe;
  }, [user]);

  const pickImage = async (isEdit = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      if (isEdit) setEditImage(result.assets[0].uri);
      else setPhoto(result.assets[0].uri);
    }
  };

  const pickMangaImage = async (isEdit = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      if (isEdit) setEditImage(result.assets[0].uri);
      else setNewItemImage(result.assets[0].uri);
    }
  };

  const saveProfile = async () => {
    try {
      let photoURL = photo;
      if (photo && photo.startsWith("file:")) {
        const response = await fetch(photo);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);
        await uploadBytes(storageRef, blob);
        photoURL = await getDownloadURL(storageRef);
      }
      await setDoc(doc(db, "users", user.uid), { name, photo: photoURL }, { merge: true });
      await updateProfile(user, { displayName: name, photoURL });
      Alert.alert("✅ Profile updated!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error updating profile");
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return Alert.alert("Please enter a manga title.");
    let imageURL = null;
    if (newItemImage && newItemImage.startsWith("file:")) {
      const response = await fetch(newItemImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `bucketImages/${user.uid}/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      imageURL = await getDownloadURL(storageRef);
    }
    const docRef = await addDoc(collection(db, "users", user.uid, "bucketList"), {
      text: newItem,
      image: imageURL,
    });
    animatedItems[docRef.id] = new Animated.Value(0);
    Animated.spring(animatedItems[docRef.id], { toValue: 1, useNativeDriver: true, friction: 6 }).start();
    setNewItem("");
    setNewItemImage(null);
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "bucketList", id));
  };

  const openEditModal = (id, text, image) => {
    setEditId(id);
    setEditText(text);
    setEditImage(image || null);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editId || !editText.trim()) return;
    let imageURL = editImage;
    if (editImage && editImage.startsWith("file:")) {
      const response = await fetch(editImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `bucketImages/${user.uid}/${Date.now()}.jpg`);
      await uploadBytes(storageRef, blob);
      imageURL = await getDownloadURL(storageRef);
    }
    await updateDoc(doc(db, "users", user.uid, "bucketList", editId), {
      text: editText,
      image: imageURL,
    });
    setEditModalVisible(false);
    setEditId(null);
    setEditText("");
    setEditImage(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const renderItem = ({ item }) => {
    const anim = animatedItems[item.id] || new Animated.Value(1);
    Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [{ scale: anim }],
          marginBottom: 15,
        }}
      >
        <View style={styles.card}>
          {item.image && <Image source={{ uri: item.image }} style={styles.mangaImage} />}
          <View style={styles.cardHeader}>
            <Image source={{ uri: photo || "https://via.placeholder.com/40" }} style={styles.cardAvatar} />
            <Text style={styles.cardUsername}>{name || "User"}</Text>
          </View>
          <Text style={styles.cardText} numberOfLines={2}>{item.text}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => openEditModal(item.id, item.text, item.image)}>
              <Text style={styles.edit}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ImageBackground source={{ uri: "https://giffiles.alphacoders.com/221/221581.gif" }} style={styles.background}>
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/home")}>
            <Text style={styles.backText}>⬅ Back to Home</Text>
          </TouchableOpacity>

          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => pickImage(false)}>
              <Image source={{ uri: photo || "https://via.placeholder.com/50" }} style={styles.topAvatar} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.topName}>{name || "User"}</Text>
              <TouchableOpacity onPress={saveProfile} style={styles.editNameBtn}>
                <Text style={styles.editNameText}>Save Profile</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addContainer}>
            <TextInput
              style={styles.input}
              placeholder="Manga title..."
              placeholderTextColor="#ccc"
              value={newItem}
              onChangeText={setNewItem}
            />
            <TouchableOpacity onPress={() => pickMangaImage(false)} style={styles.pickImageBtn}>
              <Text style={styles.pickImageText}>{newItemImage ? "📸 Image Selected" : "📁 Pick Image"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.saveText}>Add Manga</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bucketList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />

          <Modal visible={editModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Manga</Text>
                <TextInput style={styles.input} value={editText} onChangeText={setEditText} autoFocus />
                <TouchableOpacity onPress={() => pickMangaImage(true)} style={styles.pickImageBtn}>
                  <Text style={styles.pickImageText}>{editImage ? "📸 Image Selected" : "📁 Pick Image"}</Text>
                </TouchableOpacity>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                    <Text style={styles.saveText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  scroll: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 12 },
  backText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  topAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#ff6b6b" },
  topName: { color: "#fff", fontSize: 20, fontWeight: "700" },
  editNameBtn: { marginTop: 4, backgroundColor: "#ff6b6b", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  editNameText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  logoutBtn: { backgroundColor: "#ff4757", paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20 },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  addContainer: { marginBottom: 15 },
  input: { backgroundColor: "rgba(34,34,34,0.8)", color: "#fff", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 15, fontSize: 16, marginBottom: 8 },
  addBtn: { backgroundColor: "#1e90ff", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, alignItems: "center", marginBottom: 10 },
  pickImageBtn: { backgroundColor: "#555", paddingVertical: 10, borderRadius: 15, alignItems: "center", marginBottom: 8 },
  pickImageText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  card: { backgroundColor: "#222", borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 2, borderColor: "#fff" },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  cardUsername: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cardText: { color: "#fff", fontSize: 16, marginBottom: 8 },
  cardActions: { flexDirection: "row", justifyContent: "flex-end" },
  edit: { marginRight: 12, color: "#ffdc00", fontSize: 18 },
  delete: { color: "#ff3f3f", fontSize: 18 },
  mangaImage: { width: "100%", height: 150, borderRadius: 12, marginBottom: 8 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { width: 300, backgroundColor: "#222", borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 12 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 10 },
  cancelBtn: { backgroundColor: "#888", paddingVertical: 10, borderRadius: 15, alignItems: "center", width: "45%" },
  saveBtn: { backgroundColor: "#ff6b6b", paddingVertical: 10, borderRadius: 15, alignItems: "center", width: "45%" },
});
