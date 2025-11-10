import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

// 🔁 Íconos Lucide (alias para no chocar con Image de RN)
import {
  Image as ImageIcon,
  List,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react-native";

// hooks y componentes del proyecto
import { useAuth } from "../../hooks/useAuth"; // obtiene { user }
import { useTheme } from "../../hooks/useTheme"; // obtiene { theme }
import { useForm } from "../../hooks/useForm"; // maneja formularios
import { Input } from "../../components/Input"; // input estilizado

// Firebase y Cloudinary
import { auth, db } from "../../network/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  uploadToCloudinary,
  CLOUDINARY,
} from "../../network/services/imageUpload";

const CATEGORIES = ["Comida", "Juguetes", "Higiene", "Salud"];
const SIZES = ["Pequeño", "Mediano", "Grande"];

export default function AddProductoScreen() {
  const { user } = useAuth();

  // obtener colores del tema actual
  const { theme } = useTheme();
  const colors = theme;

  // formulario
  const { values, errors, handleChange, validateForm, resetForm } = useForm({
    initialValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      location: "",
      category: CATEGORIES[0],
      size: SIZES[0],
    },
    validations: {
      name: (v) => (!v?.toString().trim() ? "El nombre es obligatorio" : null),
      price: (v) =>
        /^\d+(\.\d{1,2})?$/.test(String(v))
          ? null
          : "Formato numérico válido (ej. 12.50)",
      stock: (v) => (/^\d+$/.test(String(v)) ? null : "Solo números enteros"),
    },
  });

  const [showCat, setShowCat] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  // Solicitar permisos para galería
  const solicitarPermisos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos acceso a tu galería para seleccionar imágenes."
      );
      return false;
    }
    return true;
  };

  const seleccionarImagen = async () => {
    const ok = await solicitarPermisos();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const subirImagen = async (uri: string) =>
    uploadToCloudinary(uri, CLOUDINARY);

  const handlePublicar = async () => {
    const user = auth.currentUser;

    if (!nombre.trim())
      return Alert.alert("Falta el nombre", "Ingresa el nombre del producto.");
    if (!precio.trim() || isNaN(Number(precio))) {
      return Alert.alert(
        "Precio inválido",
        "Ingresa un precio numérico (ej: 12.50)."
      );
    }

    try {
      setSubiendo(true);

      let photoURL: string | null = null;
      if (imageUri) photoURL = await subirImagen(imageUri);

      const priceNum = Number(values.price);
      const stockNum = Number(values.stock);

      const docRef = await addDoc(collection(db, "products"), {
        name: values.name.trim(),
        description: values.description.trim(),
        price: priceNum,
        stock: stockNum,
        location: values.location.trim(),
        category: values.category,
        size: values.size,
        images: photoURL ? [photoURL] : [],
        score: { avg: 0, count: 0 },
        createdBy: user?.uid ?? null,
        author: user
          ? {
              uid: user.uid,
              name: user.displayName ?? null,
              photoURL: user.photoURL ?? null,
            }
          : null,
        createdAt: serverTimestamp(),
        status: "active",
      });

      // reset
      resetForm();
      setImageUri(null);

      Alert.alert("✅ Producto publicado", `ID: ${docRef.id}`);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo publicar el producto.");
    } finally {
      setSubiendo(false);
    }
  };

  const s = themedStyles(colors);

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.content}>
        {/* Imagen */}
        <TouchableOpacity
          style={styles.imageUploader}
          onPress={seleccionarImagen}
          activeOpacity={0.85}
        >
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <Text style={styles.imageSubtitle}>
                Toca para cambiar la imagen
              </Text>
            </>
          ) : (
            <>
              <View style={s.imageIconWrapper}>
                <ImageIcon size={32} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.imageTitle}>
                Sube una foto de tu producto
              </Text>
              <Text style={styles.imageSubtitle}>
                Toca aquí para seleccionar una imagen
              </Text>
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Seleccionar Archivo</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Nombre */}
        <Input
          label="Nombre del Producto"
          placeholder="Ej: Collar de cuero para perro"
          value={values.name}
          onChangeText={(t: string) => handleChange("name", t)}
          error={errors.name}
        />

        {/* Descripción */}
        <Input
          label="Descripción"
          placeholder="Describe las características y beneficios..."
          value={values.description}
          onChangeText={(t: string) => handleChange("description", t)}
          multiline
          numberOfLines={4}
        />

        {/* Categoría (dropdown) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoría</Text>

          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setShowCat(!showCat)}
            >
              <View style={styles.dropdownLeft}>
                <List size={18} color="#6aa383" />
                <Text style={styles.dropdownText}>{category}</Text>
              </View>
              {showCat ? (
                <ChevronUp size={18} color={colors.secondaryText} />
              ) : (
                <ChevronDown size={18} color={colors.secondaryText} />
              )}
            </TouchableOpacity>

            {showCat && (
              <View style={s.dropdownList}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.dropdownItem,
                      c === category && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      handleChange("category", c);
                      setShowCat(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        c === category && styles.dropdownItemTextActive,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Precio */}
        <Input
          label="Precio"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={values.price}
          onChangeText={(t: string) => handleChange("price", t)}
          error={errors.price}
        />

        {/* Stock */}
        <Input
          label="Stock"
          placeholder="Cantidad disponible"
          keyboardType="number-pad"
          value={values.stock}
          onChangeText={(t: string) => handleChange("stock", t)}
          error={errors.stock}
        />

        {/* Tamaño */}
        <View style={s.formGroup}>
          <Text style={s.label}>Tamaño</Text>
          <View style={s.sizeRow}>
            {SIZES.map((opt) => {
              const active = opt === values.size;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => handleChange("size", opt)}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ubicación (con icono a la izquierda) */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={18} color="#6aa383" style={{ marginRight: 8 }} />
            <TextInput
              style={[
                styles.input,
                { flex: 1, borderWidth: 0, paddingHorizontal: 0 },
              ]}
              placeholder="Ingresa una dirección"
              value={values.location}
              onChangeText={(t: string) => handleChange("location", t)}
              containerStyle={{ flex: 1 }}
              inputStyle={{ borderWidth: 0, paddingHorizontal: 0 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botón inferior */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.publishButton, subiendo && { opacity: 0.7 }]}
          onPress={handlePublicar}
          disabled={subiendo}
        >
          {subiendo ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.publishText}>Publicar Producto</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8f7" },
  content: { padding: 16 },

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
  imageTitle: { fontWeight: "bold", fontSize: 16 },
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
  selectButtonText: { fontWeight: "bold", fontSize: 14 },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#2d3b34" },
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
  textArea: { height: 120, textAlignVertical: "top" },

  dropdownContainer: { position: "relative" },
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
  dropdownLeft: { flexDirection: "row", alignItems: "center" },
  dropdownText: { marginLeft: 8, fontSize: 15, color: "#1c2b24" },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#dbe6e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
  dropdownItemActive: { backgroundColor: "#e9fbf1" },
  dropdownItemText: { fontSize: 15, color: "#1c2b24" },
  dropdownItemTextActive: { fontWeight: "700", color: "#2d7a52" },

  sizeRow: { flexDirection: "row", gap: 8 },
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
  chipActive: { backgroundColor: "#13ec6d", borderColor: "#13ec6d" },
  chipText: { fontWeight: "600", color: "#2d3b34" },
  chipTextActive: { color: "#0e0f0e" },

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
  publishText: { fontSize: 16, fontWeight: "bold", color: "#000000" },
});
function themedStyles(colors: {
  primary: string;
  onPrimary: string;
  background: string;
  surface: string;
  text: string;
  secondaryText: string;
  outline: string;
  accent: string;
}) {
  throw new Error("Function not implemented.");
}
