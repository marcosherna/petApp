import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";

import { Button, Input, Label } from "../components";
import { spacing } from "../resourses/spacing";
import { useForm } from "../hooks/useForm";

import { RootStackNavigation } from "../navigations/params";

export default function RegisterScreen() {
  const navigation = useNavigation<RootStackNavigation>();
  const { values, errors, handleChange, validateForm, isFormValid } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validations: {
      name: (value) => (!value ? "El nombre es obligatorio" : null),
      email: (value) =>
        !/\S+@\S+\.\S+/.test(value) ? "Correo no válido" : null,
      password: (value) =>
        value.length < 8 ? "Debe tener al menos 8 caracteres" : null,
    },
  });

  const handleSubmit = () => {
    const valid = validateForm();
    if (!valid) return;
    console.log("Formulario válido:", values);

    if (navigation.canGoBack()) navigation.pop();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.container_content}>
          <Label size="6xl" weight="extrabold">
            Register
          </Label>
          {/* TODO: place appropriate content, such as text or images */}
        </View>

        <View>
          <Input
            label="Nombre"
            placeholder="user example"
            value={values.name}
            onChangeText={(text) => handleChange("name", text)}
            error={errors.name}
          />

          <Input
            label="Correo"
            placeholder="example.user@gmail.com"
            value={values.email}
            onChangeText={(text) => handleChange("email", text)}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            placeholder="********"
            secureTextEntry
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            error={errors.password}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button
            title="Registrarse"
            onPress={() => handleSubmit()}
            disabled={!isFormValid()}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  container_inputs: {
    gap: spacing.md,
  },
  container_content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
