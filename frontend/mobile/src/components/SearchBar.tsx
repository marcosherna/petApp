import {
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle, 
  TextInput,
  StyleSheet,
} from "react-native";
import { FontSizeKey, FontWeightKey } from "../resourses/typography";
import { useTheme } from "../hooks/useTheme";
import { getTextStyle } from "../helpers/TextStyles";
import { Search } from "lucide-react-native";


import { iconography } from "../resourses/iconography";

interface SearchBarProps
  extends Omit<TextInputProps, "style" | "keyboardType" | "multiline"> {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;

  labelSize?: FontSizeKey;
  labelWeight?: FontWeightKey;
  inputSize?: FontSizeKey;
  inputWeight?: FontWeightKey;
}

export function SearchBar({
  placeholder = "",
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,

  labelSize = "md",
  labelWeight = "semibold",
  inputSize = "md",
  inputWeight = "normal",

  ...props
}: SearchBarProps) {
  const { theme } = useTheme();

  const colors = {
    label: theme.text,
    inputBorder: theme.outline,
    inputBackground: theme.surface,
    inputText: theme.text,
    placeholder: theme.secondaryText,
  };

  const inputTextStyle = getTextStyle(
    inputSize,
    inputWeight,
    colors.inputText,
    "left"
  );

  return (
    <View
      style={[
        styles.container,
        styles.input,
        {
          borderColor: colors.inputBorder,
          backgroundColor: colors.inputBackground,
        },
      ]}
    >
      <Search color={theme.secondaryText} size={iconography.md}></Search>

      <TextInput
        style={[inputTextStyle, inputStyle]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    width: "100%",
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
});
