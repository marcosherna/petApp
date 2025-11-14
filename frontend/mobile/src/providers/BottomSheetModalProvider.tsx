import React, { useRef, useCallback, useState, useMemo } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider as GorhomProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { View } from "react-native";

import { BottomSheetModalContext } from "../contexts/BottomSheetModalContext";
import { useTheme } from "../hooks/useTheme";

export const BottomSheetModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const { theme, isDark } = useTheme();

  const snapPoints = useMemo(() => ["30%", "40%"], []);

  const openModal = useCallback((content: React.ReactNode) => {
    setModalContent(content);
    modalRef.current?.present();
  }, []);

  const closeModal = useCallback(() => {
    modalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={isDark ? 0.6 : 0.4}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="collapse"
        onPress={closeModal}
      />
    ),
    [isDark]
  );

  return (
    <GorhomProvider>
      <BottomSheetModalContext.Provider value={{ openModal, closeModal }}>
        {children}

        <BottomSheetModal
          ref={modalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: isDark ? theme.surface : theme.background,
          }}
          handleIndicatorStyle={{
            backgroundColor: isDark ? theme.outline : theme.secondaryText,
            width: 40,
          }}
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: "hidden",
          }}
        >
          {modalContent ? (
            <View style={{ padding: 20 }}>{modalContent}</View>
          ) : null}
        </BottomSheetModal>
      </BottomSheetModalContext.Provider>
    </GorhomProvider>
  );
};
