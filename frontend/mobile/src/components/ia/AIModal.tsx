/*import React from "react";
import { View, StyleSheet } from "react-native";
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

    const res = await askGroq(
      `Quiero una recomendación de productos para mi mascota con estas características: ${question}.
       Responde breve y clara, como recomendación para un usuario de una tienda de mascotas.`
    );

    setAnswer(res || "No pude generar una respuesta.");
    setLoading(false);
  };

  return (
    <BottomSheet
      title="Asistente de PetApp"
      visible={visible}
      onClose={onClose}
    >
      <Label>¿Qué producto buscas? 🐶🐾</Label>

      <Input
        placeholder="Ej: comida para perro grande, juguetes fuertes, etc."
        value={question}
        onChangeText={setQuestion}
      />

      <Button title="Preguntar a la IA" onPress={handleAsk} loading={loading} />

      {answer !== "" && <Label style={{ marginTop: 12 }}>{answer}</Label>}
    </BottomSheet>
  );
}*/
