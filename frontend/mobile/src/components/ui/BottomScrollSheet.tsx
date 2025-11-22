import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { Dimensions, StyleSheet, View, ScrollViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
  runOnJS,
  cancelAnimation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BackDrop } from "./BackDrop";

interface Props extends ScrollViewProps {
  snapTo: string;
  backgroundColor?: string;
  backDropColor?: string;
  visible: boolean;
  onClose?: () => void;
  borderRadios?: number;
  barIndicatorColor?: string;
}

export interface BottomSheetMethods {
  expand: () => void;
  close: () => void;
}

const DAMPING = 20;
const STIFFNESS = 500;
const MASS = 0.8;

export const BottomSheetScrollView = forwardRef<
  BottomSheetMethods,
  PropsWithChildren<Props>
>(
  (
    {
      snapTo,
      children,
      backgroundColor = "#fff",
      backDropColor = "black",
      visible,
      onClose,
      borderRadios = 10,
      barIndicatorColor = "#000",
      ...rest
    },
    ref
  ) => {
    const { height } = Dimensions.get("screen");

    const percentage = parseFloat(snapTo.replace("%", "")) / 100;
    const closeHeight = height;
    const openHeight = height - height * percentage;

    const topAnimation = useSharedValue(closeHeight);
    const context = useSharedValue(0);
    const scrollBegin = useSharedValue(0);
    const scrollY = useSharedValue(0);

    const [enableScroll, setEnableScroll] = useState(true);

    const expand = useCallback(() => {
      cancelAnimation(topAnimation);
      topAnimation.value = withSpring(openHeight, {
        damping: DAMPING,
        stiffness: STIFFNESS,
        mass: MASS,
      });
    }, [openHeight]);

    const close = useCallback(() => {
      cancelAnimation(topAnimation);
      topAnimation.value = withSpring(
        closeHeight,
        {
          damping: DAMPING,
          stiffness: STIFFNESS,
          mass: MASS,
        },
        (finished) => {
          if (finished && onClose) runOnJS(onClose)();
        }
      );
    }, [closeHeight, onClose]);

    useImperativeHandle(ref, () => ({ expand, close }), [expand, close]);

    useEffect(() => {
      if (visible) expand();
      else close();
    }, [visible]);

    const animationStyle = useAnimatedStyle(() => ({
      top: topAnimation.value,
    }));

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        const nextPosition = context.value + event.translationY;
        topAnimation.value = Math.min(
          Math.max(nextPosition, openHeight),
          closeHeight
        );
      })
      .onEnd(() => {
        const shouldClose = topAnimation.value > openHeight + 100;
        if (shouldClose) {
          topAnimation.value = withSpring(
            closeHeight,
            {
              damping: DAMPING,
              stiffness: STIFFNESS,
              mass: MASS,
            },
            (finished) => {
              if (finished && onClose) runOnJS(onClose)();
            }
          );
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: DAMPING,
            stiffness: STIFFNESS,
            mass: MASS,
          });
        }
      });

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: (event) => {
        scrollBegin.value = event.contentOffset.y;
      },
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
      },
    });

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value;
      })
      .onUpdate((event) => {
        if (event.translationY > 0 && scrollY.value === 0) {
          runOnJS(setEnableScroll)(false);
          const nextPosition = context.value + event.translationY;
          topAnimation.value = Math.min(
            Math.max(nextPosition, openHeight),
            closeHeight
          );
        }
      })
      .onEnd(() => {
        runOnJS(setEnableScroll)(true);
        const shouldClose = topAnimation.value > openHeight + 100;
        if (shouldClose) {
          topAnimation.value = withSpring(
            closeHeight,
            {
              damping: DAMPING,
              stiffness: STIFFNESS,
              mass: MASS,
            },
            (finished) => {
              if (finished && onClose) runOnJS(onClose)();
            }
          );
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: DAMPING,
            stiffness: STIFFNESS,
            mass: MASS,
          });
        }
      });

    const scrollViewGesture = Gesture.Native();

    return (
      <>
        <BackDrop
          topAnimation={topAnimation}
          backDropColor={backDropColor}
          closeHeight={closeHeight}
          openHeight={openHeight}
          close={close}
          visible={visible}
        />

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.container,
              animationStyle,
              {
                backgroundColor,
                borderTopLeftRadius: borderRadios,
                borderTopRightRadius: borderRadios,
              },
            ]}
          >
            <View style={styles.lineContainer}>
              <View
                style={[styles.line, { backgroundColor: barIndicatorColor }]}
              />
            </View>

            <GestureDetector
              gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}
            >
              <Animated.ScrollView
                {...rest}
                scrollEnabled={enableScroll}
                bounces={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                {children as React.ReactNode}
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lineContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: "#000",
    borderRadius: 20,
  },
});
