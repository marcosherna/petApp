import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import * as Location from "expo-location";

type Props = {
  initial?: { lat: number; lng: number } | null;
  onPick: (coords: { lat: number; lng: number }) => void;
  onClose?: () => void;
};

export default function MapPicker({ initial, onPick, onClose }: Props) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const [region, setRegion] = useState<Region>({
    latitude: initial?.lat ?? 13.69294, // San Salvador por defecto
    longitude: initial?.lng ?? -89.21819,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      // Pedir permiso de ubicación para centrar el mapa
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      }
    })();
  }, []);

  const handlePress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ lat: latitude, lng: longitude });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handlePress}
      >
        {marker && (
          <Marker
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
          />
        )}
      </MapView>

      {/* Botones inferiores */}
      <View style={styles.footer}>
        {onClose && (
          <TouchableOpacity
            style={[styles.btn, styles.cancel]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btn, !marker && { opacity: 0.6 }]}
          disabled={!marker}
          onPress={() => marker && onPick(marker)}
        >
          <Text style={styles.btnText}>Usar esta ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancel: {
    backgroundColor: "#6B7280",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
  },
});
