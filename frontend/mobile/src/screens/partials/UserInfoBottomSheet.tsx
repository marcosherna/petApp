import { View, StyleSheet, ActivityIndicator } from "react-native";

import { BottomSheetScrollView } from "../../components/ui";
import { Label } from "../../components";

import { spacing } from "../../resourses/spacing";

import UserSignIn from "./UserSigIn";
import UserNotSigIn from "./UserNotSigIn";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export const UserInfoBottomSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose?: () => void;
}) => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  return (
    <BottomSheetScrollView
      snapTo="30%"
      ref={null}
      visible={visible}
      onClose={onClose}
      backgroundColor={theme.background}
      barIndicatorColor={theme.secondaryText}
    >
      <>
        {loading && (
          <View style={style.loadingContainer}>
            <ActivityIndicator size="large" color={theme.onPrimary} />
            <Label color="gray" size="md">
              Cargando usuario...
            </Label>
          </View>
        )}

        {!loading && !user && <UserNotSigIn onClose={onClose} />}
        {!loading && user && <UserSignIn onClose={onClose} />}
      </>
    </BottomSheetScrollView>
  );
};

const style = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
});
