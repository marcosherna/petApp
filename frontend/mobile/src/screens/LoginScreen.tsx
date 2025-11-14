import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { Loading } from "../components/ui";
import { Button, Input, Label } from "../components";
import { RootStackNavigation } from "../navigations/params";

import { spacing } from "../resourses/spacing";

import { useForm } from "../hooks/useForm"; 
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { sigIn } = useAuth()
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<RootStackNavigation>();

  const { values, errors, handleChange, validateForm, isFormValid } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validations: {
      email: (value) =>
        !/\S+@\S+\.\S+/.test(value) ? "Correo no válido" : null,
      password: (value) =>
        value.length < 8 ? "Debe tener al menos 8 caracteres" : null,
    },
  });

  const handleSubmit = async () => {
    const valid = validateForm();
    if (!valid) return;
    try {
      setLoading(true);
      const { email, password } = values;

      await sigIn(email, password); 

      if (navigation.canGoBack()) navigation.pop();
    } catch (error) {
      // TOOD: implement toast
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container_content}>
          <Label size="5xl" weight="extrabold">
            Login
          </Label>
          {/* TODO: place appropriate content, such as text or images */}
        </View>

        <View>
          <Input
            label="Correo"
            placeholder="example.user@gmail.com"
            value={values.email}
            keyboardType="email-address"
            onChangeText={(text) => handleChange("email", text)}
            error={errors.email}
          />

          <Input
            label="Contraseña"
            placeholder="admin-1234"
            // secureTextEntry={true} TODO: hace ruido visual
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            error={errors.password}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Button
            title="Iniciar sesion"
            onPress={() => handleSubmit()}
            disabled={!isFormValid()}
          />
        </View>
      </KeyboardAwareScrollView>

      <Loading visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  container_inputs: {
    gap: spacing.md,
  },
  container_content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
