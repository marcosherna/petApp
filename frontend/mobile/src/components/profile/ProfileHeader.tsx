import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Label, Button } from "../../components";
import { useTheme } from "../../hooks/useTheme";
import { spacing } from "../../resourses/spacing";

interface Props {
  photo: string | null;
  updatingPhoto: boolean;
  name: string;
  email: string;
  productCount: number;
  onChangePhoto: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

export function ProfileHeader({
  photo,
  updatingPhoto,
  name,
  email,
  productCount,
  onChangePhoto,
  onEditProfile,
  onLogout,
}: Props) {
  const { theme } = useTheme();
  const AVATAR = 110;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        },
      ]}
    >
      {/* FOTO */}
      <TouchableOpacity onPress={onChangePhoto} activeOpacity={0.8}>
        <View
          style={[
            styles.avatarWrapper,
            {
              width: AVATAR,
              height: AVATAR,
              borderRadius: AVATAR / 2,
            },
          ]}
        >
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImg} />
          ) : (
            <Label>{updatingPhoto ? "..." : "Sin foto"}</Label>
          )}
        </View>
      </TouchableOpacity>

      {/* NOMBRE – CORREO */}
      <View style={styles.userRow}>
        <Label weight="bold" size="lg">
          {name}
        </Label>

        <Label color={theme.secondaryText} weight="medium">
          {"  –  "}
        </Label>

        <Label color={theme.secondaryText} weight="medium">
          {email}
        </Label>
      </View>

      {/* PUBLICADOS */}
      <Label>
        Publicados:{" "}
        <Label weight="bold" color={theme.primary}>
          {productCount}
        </Label>
      </Label>

      {/* BOTONES COMPACTOS */}
      <View style={styles.buttonsRow}>
        <Button
          title="Editar"
          variant="secondary"
          onPress={onEditProfile}
          style={styles.smallBtn}
          textSize="sm"
          textWeight="medium"
        />

        <Button
          title="Salir"
          onPress={onLogout}
          style={[
            styles.smallBtn,
            { backgroundColor: "#dc2626", borderColor: "#dc2626" },
          ]}
          textSize="sm"
          textWeight="medium"
        />
      </View>
    </View>
  );
}

/* ESTILOS */
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarWrapper: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minWidth: 80,
    borderRadius: 10,
  },
});
