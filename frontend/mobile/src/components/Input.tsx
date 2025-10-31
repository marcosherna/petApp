import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  Text,
} from "react-native";
import { getTextStyle } from "../helpers/TextStyles";
import { FontSizeKey, FontWeightKey } from "../resourses/typography";
import { useTheme } from "../hooks/useTheme";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;

  labelSize?: FontSizeKey;
  labelWeight?: FontWeightKey;
  inputSize?: FontSizeKey;
  inputWeight?: FontWeightKey;
  errorSize?: FontSizeKey;
  errorWeight?: FontWeightKey;
}

export function Input({
  label = "",
  error = "",
  placeholder = "",
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  keyboardType = "default",
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,

  labelSize = "md",
  labelWeight = "semibold",
  inputSize = "md",
  inputWeight = "normal",
  errorSize = "sm",
  errorWeight = "medium",

  ...props
}: InputProps) {
  const { theme } = useTheme();

  const colors = {
    label: theme.text,
    inputBorder: theme.outline,
    inputBackground: theme.surface,
    inputText: theme.text,
    placeholder: theme.secondaryText,
    error: "#EF4444",
  };

  const labelTextStyle = getTextStyle(
    labelSize,
    labelWeight,
    colors.label,
    "left"
  );
  const inputTextStyle = getTextStyle(
    inputSize,
    inputWeight,
    colors.inputText,
    "left"
  );
  const errorTextStyle = getTextStyle(
    errorSize,
    errorWeight,
    colors.error,
    "left"
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[{ marginBottom: 8 }, labelTextStyle, labelStyle]}>
          {label}
        </Text>
      ) : null}

      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.inputBorder,
            backgroundColor: colors.inputBackground,
          },
          multiline && styles.multilineInput,
          inputTextStyle,
          inputStyle,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
        placeholderTextColor={colors.placeholder}
        {...props}
      />

      {error ? <Text style={[errorTextStyle, errorStyle]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});
