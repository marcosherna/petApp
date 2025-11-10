import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface SegmentOption {
  label: string;
  value: string | number;
}

interface SegmentProps {
  options: SegmentOption[];
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  containerStyle?: ViewStyle;
  activeSegmentStyle?: ViewStyle;
  inactiveSegmentStyle?: ViewStyle;
  activeTextStyle?: TextStyle;
  inactiveTextStyle?: TextStyle;
  thumbStyle?: ViewStyle;
  disabled?: boolean;
  borderRadius?: number;
}

const SegmentComponent: React.FC<SegmentProps> = ({
  options,
  defaultValue,
  onChange,
  containerStyle,
  activeSegmentStyle,
  inactiveSegmentStyle,
  activeTextStyle,
  inactiveTextStyle,
  thumbStyle,
  disabled = false,
  borderRadius = 18,
}) => {
  const { theme } = useTheme();

  const [selected, setSelected] = useState<string | number>(
    defaultValue ?? options[0]?.value
  );

  const handlePress = (value: string | number) => {
    if (disabled) return;
    setSelected(value);
    onChange?.(value);
  };

  const segmentWidth = `${100 / options.length}%` as const;

  const colors = useMemo(
    () => ({
      thumb: `${theme.primary}33`,
      textActive: theme.primary,
      textInactive: theme.secondaryText,
      background: theme.surface,
    }),
    [theme]
  );

  return (
    <View style={[styles.container, { borderRadius }, containerStyle]}>
      {/* Indicador activo */}
      <View
        style={[
          styles.thumb,
          thumbStyle,
          {
            width: segmentWidth,
            left: `${
              (options.findIndex((o) => o.value === selected) * 100) /
              options.length
            }%`,
            backgroundColor: colors.thumb,
            zIndex: 1,
          },
          { borderRadius, borderWidth: 1, borderColor: theme.primary },
        ]}
      />

      {/* Fondo y botones */}
      <View
        style={[
          styles.background,
          { backgroundColor: colors.background },
          disabled && styles.disabled,
          { borderRadius },
        ]}
      >
        {options.map((option, index) => {
          const isActive = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.segment,
                { width: segmentWidth },
                index === 0 && styles.firstSegment,
                index === options.length - 1 && styles.lastSegment,
                isActive
                  ? [styles.activeSegment, activeSegmentStyle]
                  : [styles.inactiveSegment, inactiveSegmentStyle],
                { zIndex: 2 },
              ]}
              activeOpacity={0.7}
              onPress={() => handlePress(option.value)}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.text,
                  isActive
                    ? [
                        styles.activeText,
                        { color: colors.textActive },
                        activeTextStyle,
                      ]
                    : [
                        styles.inactiveText,
                        { color: colors.textInactive },
                        inactiveTextStyle,
                      ],
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: 44,
    justifyContent: "center",
    borderRadius: 22,
  },
  thumb: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2, 
  },
  background: {
    flexDirection: "row",
    height: "100%",
    borderRadius: 22,
  },
  segment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  firstSegment: {
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  lastSegment: {
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
  activeSegment: {},
  inactiveSegment: {},
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeText: {},
  inactiveText: {},
  disabled: {
    opacity: 0.5,
  },
});

export const Segment = React.memo(SegmentComponent);
