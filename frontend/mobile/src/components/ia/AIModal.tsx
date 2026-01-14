import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { BottomSheet } from "../BottomSheet";
import { Input, Button, Label } from "../../components";

import { askGroq } from "../../network/services/groq";

export function AIModal({ visible, onClose }: any) {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    const res = await askGroq(`
Eres un asistente de productos de mascotas integrado con la app PetApp.

Instrucciones:
- Resume rápido lo que el usuario necesita.
- Recomienda 1–3 productos típicos de tiendas de mascotas.
- Menciona si son adecuados según su descripción.
- Al final SIEMPRE agrega:
  "Puedes buscarlos en PetMark como: <palabras clave recomendadas>"

Descripción del usuario: ${question}
`);

    setAnswer(res || "No pude generar una respuesta.");
    setLoading(false);
  };

  return (
    <BottomSheet
      title="Asistente de PetApp"
      visible={visible}
      onClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Label>¿Qué producto buscas? 🐶🐾</Label>

        <Input
          placeholder="Ej: comida para perro grande, juguetes resistentes…"
          value={question}
          onChangeText={setQuestion}
        />

        <Button
          title="Preguntar a la IA"
          onPress={handleAsk}
          loading={loading}
          style={{ marginTop: 10 }}
        />

        {answer !== "" && <Label style={{ marginTop: 12 }}>{answer}</Label>}
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}
