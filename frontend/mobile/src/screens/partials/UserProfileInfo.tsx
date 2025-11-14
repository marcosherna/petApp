import React, { useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

import { IconButton } from "../../components";

import { useGlobalBottomSheetModal } from "../../hooks/useGlobalBottomSheetModal";
import { useAuth } from "../../hooks/useAuth";

import UserSignIn from "./UserSigIn";
import UserNotSigIn from "./UserNotSigIn";

export default function UserProfileInfo() {
  const { user, loading } = useAuth();
  const { openModal, closeModal } = useGlobalBottomSheetModal();

  const modalContent = useMemo(() => {
    if (loading) {
      return (
        <BottomSheetView>
          <View style={{ alignItems: "center", padding: 16 }}>
            <Text style={{ fontSize: 16 }}>Cargando...</Text>
          </View>
        </BottomSheetView>
      );
    }

    return (
      <BottomSheetView>
        {user ? (
          <UserSignIn onClose={closeModal} />
        ) : (
          <UserNotSigIn onClose={closeModal} />
        )}
      </BottomSheetView>
    );
  }, [user, loading]);

  const handleBottomSheet = useCallback(() => {
    openModal(modalContent);
  }, [openModal, modalContent]);

  return <IconButton icon="Settings" size={22} onPress={handleBottomSheet} />;
}
