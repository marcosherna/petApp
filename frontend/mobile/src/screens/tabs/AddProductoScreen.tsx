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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image as ImageIcon, List, ChevronDown, ChevronUp, MapPin } from "lucide-react-native";

// hooks y componentes del proyecto
import { useAuth } from "../../hooks/useAuth";           // obtiene { user } (solo para createdBy/author)
import { useTheme } from "../../hooks/useTheme";         // obtiene { theme }
import { useForm } from "../../hooks/useForm";           // maneja formularios
import { Input } from "../../components/Input";          // input estilizado

// Firebase y Cloudinary
import { db } from "../../network/firebase";             // si 'db' no existe aquí, usa: ../../../firebaseConfig
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary, CLOUDINARY } from "../../network/services/imageUpload";

// Mapa nativo (tu archivo reemplazado)
import MapPicker from "../../components/MapPicker";

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
        /^\d+(\.\d{1,2})?$/.test(String(v)) ? null : "Formato numérico válido (ej. 12.50)",
      stock: (v) => (/^\d+$/.test(String(v)) ? null : "Solo números enteros"),
    },
  });

  const [showCat, setShowCat] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  // mapa
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Solicitar permisos para galería
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
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const subirImagen = async (uri: string) => uploadToCloudinary(uri, CLOUDINARY);

  const handlePublicar = async () => {
    const ok = validateForm();
    if (!ok) return;

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
          ? { uid: user.uid, name: user.displayName ?? null, photoURL: user.photoURL ?? null }
          : null,
        createdAt: serverTimestamp(),
        status: "active",
        coords: coords ? { lat: coords.lat, lng: coords.lng } : null, // ← guarda coordenadas del mapa nativo
      });

      // reset
      resetForm();
      setImageUri(null);
      setCoords(null);

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
        <TouchableOpacity style={s.imageUploader} onPress={seleccionarImagen} activeOpacity={0.85}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={s.preview} />
              <Text style={s.imageSubtitle}>Toca para cambiar la imagen</Text>
            </>
          ) : (
            <>
              <View style={s.imageIconWrapper}>
                <ImageIcon size={32} color={colors.primary} strokeWidth={2} />
              </View>
              <Text style={s.imageTitle}>Sube una foto de tu producto</Text>
              <Text style={s.imageSubtitle}>Toca aquí para seleccionar una imagen</Text>
              <View style={s.selectButton}>
                <Text style={s.selectButtonText}>Seleccionar Archivo</Text>
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

        {/* Categoría */}
        <View style={s.formGroup}>
          <Text style={s.label}>Categoría</Text>
          <View style={s.dropdownContainer}>
            <TouchableOpacity style={s.dropdownHeader} onPress={() => setShowCat(!showCat)}>
              <View style={s.dropdownLeft}>
                <List size={18} color={colors.secondaryText} />
                <Text style={s.dropdownText}>{values.category}</Text>
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
                    style={[s.dropdownItem, c === values.category && s.dropdownItemActive]}
                    onPress={() => {
                      handleChange("category", c);
                      setShowCat(false);
                    }}
                  >
                    <Text
                      style={[
                        s.dropdownItemText,
                        c === values.category && s.dropdownItemTextActive,
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
                  <Text style={[s.chipText, active && s.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ubicación */}
        <View style={s.formGroup}>
          <Text style={s.label}>Ubicación</Text>
          <View style={s.inputWithIcon}>
            <MapPin size={18} color={colors.secondaryText} style={{ marginRight: 8 }} />
            <Input
              placeholder="Ingresa una dirección"
              value={values.location}
              onChangeText={(t: string) => handleChange("location", t)}
              containerStyle={{ flex: 1 }}
              inputStyle={{ borderWidth: 0, paddingHorizontal: 0 }}
            />
          </View>

          {/* Botón para abrir mapa */}
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity style={s.selectButton} onPress={() => setShowMap(true)}>
              <Text style={s.selectButtonText}>
                {coords
                  ? `📍 Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)} (Cambiar)`
                  : "Elegir en el mapa"}
              </Text>
            </TouchableOpacity>
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
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={s.publishText}>Publicar Producto</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal del mapa (usa el MapPicker nativo) */}
      <Modal visible={showMap} animationType="slide" onRequestClose={() => setShowMap(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1 }}>
            <MapPicker
              initial={coords ?? { lat: 13.68935, lng: -89.18718 }} // San Salvador por defecto
              onPick={(p) => setCoords(p)}
              onClose={() => setShowMap(false)}
            />
          </View>
          <View style={{ padding: 12 }}>
            <TouchableOpacity style={s.publishButton} onPress={() => setShowMap(false)}>
              <Text style={s.publishText}>Usar esta ubicación</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// estilos
const themedStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16 },
    imageUploader: {
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.outline,
      borderStyle: "dashed",
      borderRadius: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      marginBottom: 20,
    },
    imageIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.surfaceAlt ?? "#e9fbf1",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    preview: { width: "100%", height: 220, borderRadius: 12, resizeMode: "cover" },
    imageTitle: { fontWeight: "bold", fontSize: 16, color: colors.text },
    imageSubtitle: { fontSize: 13, color: colors.secondaryText, marginTop: 6, marginBottom: 10 },
    selectButton: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 24,
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
    },
    selectButtonText: { fontWeight: "bold", fontSize: 14, color: colors.text },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: colors.text },
    inputWithIcon: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 12,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      height: 48,
    },
    dropdownContainer: { position: "relative" },
    dropdownHeader: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 12,
      backgroundColor: colors.surface,
      height: 48,
      paddingHorizontal: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dropdownLeft: { flexDirection: "row", alignItems: "center" },
    dropdownText: { marginLeft: 8, fontSize: 15, color: colors.text },
    dropdownList: {
      marginTop: 6,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 12,
      backgroundColor: colors.surface,
      overflow: "hidden",
    },
    dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
    dropdownItemActive: { backgroundColor: colors.surfaceAlt ?? "#e9fbf1" },
    dropdownItemText: { fontSize: 15, color: colors.text },
    dropdownItemTextActive: { fontWeight: "700", color: colors.primary },
    sizeRow: { flexDirection: "row", gap: 8 },
    chip: {
      paddingHorizontal: 14,
      height: 38,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.outline,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontWeight: "600", color: colors.text },
    chipTextActive: { color: colors.onPrimary },
    footer: { borderTopWidth: 1, borderColor: colors.outline, backgroundColor: colors.surface, padding: 16 },
    publishButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
    publishText: { fontSize: 16, fontWeight: "bold", color: colors.onPrimary },
  });
