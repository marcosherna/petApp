import { useContext } from "react";

import { BottomSheetModalContext } from "../contexts/BottomSheetModalContext";

export const useGlobalBottomSheetModal = () =>
  useContext(BottomSheetModalContext);
