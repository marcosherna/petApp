import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

const buildHTML = (lat: number, lng: number) => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0;padding:0}</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map').setView([${lat}, ${lng}], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  let marker = L.marker([${lat}, ${lng}], { draggable: true }).addTo(map);

  function send(pos) {
    window.ReactNativeWebView.postMessage(JSON.stringify(pos));
  }

  marker.on('dragend', () => {
    const p = marker.getLatLng();
    send({ lat: p.lat, lng: p.lng });
  });

  map.on('click', (e) => {
    const { latlng } = e;
    marker.setLatLng(latlng);
    send({ lat: latlng.lat, lng: latlng.lng });
  });
</script>
</body>
</html>`;

type Props = {
  initial?: { lat: number; lng: number };
  onPick: (pos: { lat: number; lng: number }) => void;
};

export default function MapPicker({ initial, onPick }: Props) {
  const start = initial ?? { lat: 13.68935, lng: -89.18718 }; // San Salvador de ejemplo
  const source = useMemo(() => ({ html: buildHTML(start.lat, start.lng) }), [start.lat, start.lng]);

  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(e.nativeEvent.data);
      if (data && typeof data.lat === "number" && typeof data.lng === "number") {
        onPick(data);
      }
    } catch {}
  };

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={source} onMessage={handleMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
