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
import { Search } from "lucide-react-native";

import { FontSizeKey, FontWeightKey } from "../resourses/typography";
import { useTheme } from "../hooks/useTheme";
import { getTextStyle } from "../helpers/TextStyles";
import { iconography } from "../resourses/iconography";

interface SearchBarProps
  extends Omit<TextInputProps, "style" | "keyboardType" | "multiline"> {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;

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
          size={iconography.md}
          strokeWidth={2}
          style={styles.icon}
        />

        <TextInput
          style={[styles.input, inputTextStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessible
          accessibilityLabel="Buscar"
          accessibilityHint="Campo de búsqueda"
          {...props}
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
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  icon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
});

export default memo(SearchBar);
