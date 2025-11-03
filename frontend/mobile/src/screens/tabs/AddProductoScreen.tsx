import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Firebase
import { auth,} from "../../network/firebase";
import { storage, db } from "../../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATEGORIES = ["Comida", "Juguetes", "Accesorios", "Camas", "Higiene"];
const SIZES = ["Pequeño", "Mediano", "Grande"];

export default function AddProductoScreen() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const [category, setCategory] = useState(CATEGORIES[0]);
  const [size, setSize] = useState<string>(SIZES[0]);
  const [showCat, setShowCat] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería para seleccionar imágenes.");
      return false;
    }
    return true;
  };

  const seleccionarImagen = async () => {
    const ok = await solicitarPermisos();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images", // API nueva
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const res = await fetch(uri);
    return await res.blob();
  };

  const subirImagenAStorage = async (uri: string): Promise<string> => {
    const user = auth.currentUser;
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 100000)}.jpg`;
    const storageRef = ref(storage, `products/${user?.uid ?? "anon"}/${fileName}`);
    const blob = await uriToBlob(uri);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handlePublicar = async () => {
    const user = auth.currentUser;

    if (!nombre.trim()) return Alert.alert("Falta el nombre", "Ingresa el nombre del producto.");
    if (!precio.trim() || isNaN(Number(precio))) {
      return Alert.alert("Precio inválido", "Ingresa un precio numérico (ej: 12.50).");
    }

    try {
      setSubiendo(true);

      let photoURL: string | null = null;
      if (imageUri) {
        photoURL = await subirImagenAStorage(imageUri);
      }

      const docRef = await addDoc(collection(db, "products"), {
        name: nombre.trim(),
        description: descripcion.trim(),
        price: Number(precio),
        location: ubicacion.trim(),
        category,            // 👈 agregado
        size,                // 👈 agregado
        images: photoURL ? [photoURL] : [],
        createdBy: user?.uid ?? null,
        createdAt: serverTimestamp(),
        status: "active",
      });

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setUbicacion("");
      setCategory(CATEGORIES[0]);
      setSize(SIZES[0]);
      setImageUri(null);

      Alert.alert("Producto publicado", `ID: ${docRef.id}`);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo publicar el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Imagen */}
        <TouchableOpacity style={styles.imageUploader} onPress={seleccionarImagen} activeOpacity={0.85}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Text style={styles.imageSubtitle}>Toca para cambiar la imagen</Text>
            </>
          ) : (
            <>
              <View style={styles.imageIconWrapper}>
                <Ionicons name="image-outline" size={32} color="#13ec6d" />
              </View>
              <Text style={styles.imageTitle}>Sube una foto de tu producto</Text>
              <Text style={styles.imageSubtitle}>Toca aquí para seleccionar una imagen</Text>
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Seleccionar Archivo</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Nombre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre del Producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Collar de cuero para perro"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        {/* Descripción */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe las características y beneficios..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />
        </View>

        {/* Categoría (dropdown) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría</Text>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownHeader} onPress={() => setShowCat(!showCat)}>
              <View style={styles.dropdownLeft}>
                <MaterialCommunityIcons name="format-list-bulleted" size={18} color="#6aa383" />
                <Text style={styles.dropdownText}>{category}</Text>
              </View>
              <Ionicons
                name={showCat ? "chevron-up-outline" : "chevron-down-outline"}
                size={18}
                color="#6aa383"
              />
            </TouchableOpacity>

            {showCat && (
              <View style={styles.dropdownList}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.dropdownItem, c === category && styles.dropdownItemActive]}
                    onPress={() => {
                      setCategory(c);
                      setShowCat(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, c === category && styles.dropdownItemTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Precio */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={precio}
            onChangeText={setPrecio}
          />
        </View>

        {/* Tamaño (chips) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Opciones de Tamaño</Text>
          <View style={styles.sizeRow}>
            {SIZES.map((s) => {
              const active = s === size;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSize(s)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ubicación (con icono a la izquierda) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="location-outline" size={18} color="#6aa383" style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
              placeholder="Ingresa una dirección"
              value={ubicacion}
              onChangeText={setUbicacion}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botón inferior */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.publishButton, subiendo && { opacity: 0.7 }]}
          onPress={handlePublicar}
          disabled={subiendo}
        >
          {subiendo ? <ActivityIndicator /> : <Text style={styles.publishText}>Publicar Producto</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // contenedor general
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },

  // cuerpo principal
  content: {
    padding: 16,
  },

  // sección de imagen
  imageUploader: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#dbe6e0",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  imageIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e9fbf1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imageTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  imageSubtitle: {
    fontSize: 13,
    color: "#618972",
    marginTop: 6,
    marginBottom: 10,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f8faf9",
  },
  selectButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  // campos del formulario
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#2d3b34",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    color: "#1c2b24",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  // Dropdown categoría
  dropdownContainer: {
    position: "relative",
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    height: 48,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 15,
    color: "#1c2b24",
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#e9fbf1",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#1c2b24",
  },
  dropdownItemTextActive: {
    fontWeight: "700",
    color: "#2d7a52",
  },

  // Tamaño chips
  sizeRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#cfe4d7",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  chipActive: {
    backgroundColor: "#13ec6d",
    borderColor: "#13ec6d",
  },
  chipText: {
    fontWeight: "600",
    color: "#2d3b34",
  },
  chipTextActive: {
    color: "#0e0f0e",
  },

  // input con icono
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    height: 48,
  },

  // botón inferior
  footer: {
    borderTopWidth: 1,
    borderColor: "#dbe6e0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  publishButton: {
    backgroundColor: "#13ec6d",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#13ec6d",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  publishText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});