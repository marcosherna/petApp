import React, { memo } from "react";
import {
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  TextInput,
  StyleSheet,
} from "react-native";
import { Search, X } from "lucide-react-native";

import { FontSizeKey, FontWeightKey } from "../../resourses/typography";
import { useTheme } from "../../hooks/useTheme";
import { getTextStyle } from "../../helpers/TextStyles";
import { iconography } from "../../resourses/iconography";

import { GestureIconButton } from "./GestureIconButton";

interface SearchBarProps
  extends Omit<TextInputProps, "style" | "keyboardType" | "multiline"> {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  onClear?: () => void;

  labelSize?: FontSizeKey;
  labelWeight?: FontWeightKey;
  inputSize?: FontSizeKey;
  inputWeight?: FontWeightKey;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  inputContainerStyle,
  onClear,

  labelSize = "md",
  labelWeight = "semibold",
  inputSize = "md",
  inputWeight = "normal",

  ...props
}) => {
  const { theme } = useTheme();

  const colors = {
    border: theme.outline,
    background: theme.surface,
    text: theme.text,
    placeholder: theme.secondaryText,
    icon: theme.secondaryText,
  };

  const inputTextStyle = getTextStyle(
    inputSize,
    inputWeight,
    colors.text,
    "left"
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
          inputContainerStyle,
        ]}
      >
        <Search
          color={colors.icon}
          size={iconography.sm}
          strokeWidth={2}
          style={styles.icon}
        />

        <TextInput
          style={[styles.input, inputTextStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={(text) => onChangeText?.(text)}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          blurOnSubmit={false}
          accessible
          accessibilityLabel="Buscar"
          accessibilityHint="Campo de búsqueda"
          {...props}
        />

        <GestureIconButton
          icon="X"
          size={iconography.sm}
          style={styles.icon}
          onPress={onClear}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: 0,
    paddingLeft: 12,
    height: 48,
    gap: 8,
  },
  icon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});

export default memo(SearchBar);
