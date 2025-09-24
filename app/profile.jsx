import React, { useEffect, useState, useRef } from "react";
import Feather from "react-native-vector-icons/Feather";
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
  Animated,
  FlatList,
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
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [bucketList, setBucketList] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);

  const storage = getStorage();
  const router = useRouter();

  const saveAnim = useRef(new Animated.Value(1)).current;
  const addAnim = useRef(new Animated.Value(1)).current;
  const logoutAnim = useRef(new Animated.Value(1)).current;

  // Animated values for each bucket list item
  const animatedItems = useRef({}).current;

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
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

      // Initialize animated value for new items
      items.forEach((item) => {
        if (!animatedItems[item.id]) animatedItems[item.id] = new Animated.Value(0);
      });
    });
    return unsubscribe;
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const animateButton = async (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const saveProfile = async () => {
    await animateButton(saveAnim);
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
    await animateButton(addAnim);
    if (!newItem.trim()) return;
    const docRef = await addDoc(collection(db, "users", user.uid, "bucketList"), { text: newItem });
    animatedItems[docRef.id] = new Animated.Value(0);
    Animated.spring(animatedItems[docRef.id], { toValue: 1, useNativeDriver: true, friction: 5 }).start();
    setNewItem("");
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "bucketList", id));
    Alert.alert("🗑️ Item removed!");
  };

  const openEditModal = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (editId && editText.trim()) {
      await updateDoc(doc(db, "users", user.uid, "bucketList", editId), { text: editText });
      Alert.alert("✅ Item updated!");
    }
    setEditModalVisible(false);
    setEditId(null);
    setEditText("");
  };

  const handleLogout = async () => {
    await animateButton(logoutAnim);
    await signOut(auth);
    router.replace("/");
  };

  const renderItem = ({ item }) => {
    const anim = animatedItems[item.id] || new Animated.Value(1);
    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
          ],
          marginBottom: 15,
        }}
      >
        <View style={styles.postCard}>
          {/* Header with avatar + username */}
          <View style={styles.postHeader}>
            <Image source={{ uri: photo || "https://via.placeholder.com/40" }} style={styles.postAvatar} />
            <Text style={styles.postUsername}>{name || "User"}</Text>
          </View>

          {/* Post content */}
          <Text style={styles.postText}>{item.text}</Text>

          {/* Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity onPress={() => openEditModal(item.id, item.text)}>
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
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity onPress={() => router.replace("/home")} style={styles.backBtn}>
  <Feather name="arrow-left" size={24} color="#fff" />
  <Text style={styles.backText}>Back</Text>
</TouchableOpacity>
          <Text style={styles.sectionTitle}>👤 Profile Info</Text>

          <TouchableOpacity onPress={pickImage}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholder]}>
                <Text style={{ color: "#aaa" }}>Pick Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
              <Text style={styles.saveText}>Save Profile</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.sectionTitle}>📋 My Bucket List</Text>

          <TextInput
            style={styles.input}
            placeholder="Add to bucket list..."
            placeholderTextColor="#999"
            value={newItem}
            onChangeText={setNewItem}
          />
          <Animated.View style={{ transform: [{ scale: addAnim }] }}>
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.saveText}>Add Item</Text>
            </TouchableOpacity>
          </Animated.View>

          <FlatList
            data={bucketList}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 30 }}
          />

          <Animated.View style={{ transform: [{ scale: logoutAnim }] }}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal visible={editModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Item</Text>
              <TextInput style={styles.input} value={editText} onChangeText={setEditText} />
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
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: "cover" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  scroll: { alignItems: "center", padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 15, marginTop: 25, textAlign: "center", textShadowColor: "rgba(0,0,0,0.7)", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 3, borderColor: "#ff6b6b" },
  placeholder: { backgroundColor: "#333", alignItems: "center", justifyContent: "center" },
  input: { width: 280, backgroundColor: "rgba(34,34,34,0.8)", color: "#fff", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 15, marginBottom: 15, fontSize: 16 },
  saveBtn: { backgroundColor: "#ff6b6b", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginBottom: 15, width: 140, borderWidth: 2, borderColor: "#fff" },
  addBtn: { backgroundColor: "#1e90ff", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginBottom: 20, width: 140, borderWidth: 2, borderColor: "#fff" },
  logoutBtn: { backgroundColor: "#ff4757", paddingVertical: 12, borderRadius: 25, alignItems: "center", marginTop: 30, width: 160, borderWidth: 2, borderColor: "#fff" },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 15, textAlign: "center", textShadowColor: "rgba(0,0,0,0.6)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  postCard: { backgroundColor: "#222", borderRadius: 15, padding: 15, width: 280, borderWidth: 2, borderColor: "#fff", shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 2, height: 2 }, shadowRadius: 4 },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  postAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  postUsername: { color: "#fff", fontWeight: "700", fontSize: 16 },
  postText: { color: "#fff", fontSize: 16, marginBottom: 10 },
  postActions: { flexDirection: "row", justifyContent: "flex-end" },
  edit: { marginRight: 12, color: "#ffdc00", fontSize: 18 },
  delete: { color: "#ff3f3f", fontSize: 18 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  modalContent: { width: 300, backgroundColor: "#222", borderRadius: 16, padding: 20, alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 15 },
  modalActions: { flexDirection: "row", marginTop: 10, justifyContent: "space-between", width: "100%" },
 logoutBtn: {
  backgroundColor: "#ff4757",
  paddingVertical: 14,
  borderRadius: 25,
  alignItems: "center",
  marginBottom: 20,
  width: 200,
},
logoutText: {
  color: "#fff",
  fontWeight: "800",
  fontSize: 18,
  textAlign: "center",
  textTransform: "uppercase", // makes text uppercase like Instagram
},

  cancelBtn: { backgroundColor: "#888", paddingVertical: 10, borderRadius: 20, alignItems: "center", width: "45%" },
  backBtn: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
  alignSelf: "flex-start",
},
backText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
  marginLeft: 6,
},

});
