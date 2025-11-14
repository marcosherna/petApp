import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ImageItem {
  id: string | number;
  source: { uri: string } | number;
}

interface ImageCarouselProps {
  images: ImageItem[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  indicatorColor?: string;
  indicatorActiveColor?: string;
  indicatorSize?: number;
  borderRadius?: number;
  borderRadiusTop?: number;
  borderRadiusBottom?: number;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  fullWidth?: boolean; 
  itemSpacing?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 200,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
  indicatorColor = "#ccc",
  indicatorActiveColor = "#007AFF",
  indicatorSize = 8,
  borderRadius = 12,
  borderRadiusTop,
  borderRadiusBottom,
  loop = true,
  onIndexChange,
  fullWidth = true,
  itemSpacing = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(SCREEN_WIDTH);
  const flatListRef = useRef<FlatList<ImageItem>>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    intervalRef.current = setInterval(() => {
      flatListRef.current?.scrollToIndex({
        index:
          currentIndex + 1 >= images.length
            ? loop
              ? 0
              : images.length - 1
            : currentIndex + 1,
        animated: true,
      });
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, autoPlayInterval, images.length, loop, currentIndex]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x /
          ((fullWidth ? SCREEN_WIDTH : layoutWidth) + itemSpacing)
      );
      if (index !== currentIndex) {
        setCurrentIndex(index);
        onIndexChange?.(index);
      }
    },
    [currentIndex, onIndexChange, fullWidth, layoutWidth, itemSpacing]
  );

  const imageStyle = useMemo(
    () => ({
      borderRadius,
      borderTopLeftRadius: borderRadiusTop ?? borderRadius,
      borderTopRightRadius: borderRadiusTop ?? borderRadius,
      borderBottomLeftRadius: borderRadiusBottom ?? borderRadius,
      borderBottomRightRadius: borderRadiusBottom ?? borderRadius,
    }),
    [borderRadius, borderRadiusTop, borderRadiusBottom]
  );

  const renderItem = useCallback(
    ({ item }: { item: ImageItem }) => (
      <View
        style={[
          styles.imageContainer,
          {
            width: fullWidth ? SCREEN_WIDTH : layoutWidth,
            height,
            marginRight: itemSpacing,
          },
        ]}
      >
        <Image
          source={item.source}
          style={[styles.image, imageStyle]}
          resizeMode="cover"
        />
      </View>
    ),
    [height, layoutWidth, fullWidth, imageStyle, itemSpacing]
  );

  const keyExtractor = useCallback((item: ImageItem) => item.id.toString(), []);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
    >
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled={itemSpacing === 0} 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length:
            (fullWidth ? SCREEN_WIDTH : layoutWidth) + (index > 0 ? itemSpacing : 0),
          offset:
            ((fullWidth ? SCREEN_WIDTH : layoutWidth) + itemSpacing) * index,
          index,
        })}
        windowSize={3}
        maxToRenderPerBatch={2}
        initialNumToRender={1}
        removeClippedSubviews
        bounces={false}
        decelerationRate="fast"
        snapToInterval={
          (fullWidth ? SCREEN_WIDTH : layoutWidth) + itemSpacing
        }
        snapToAlignment="start"
      />
 
      {showIndicators && images.length > 1 && (
        <View style={styles.indicators}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  width: indicatorSize,
                  height: indicatorSize,
                  borderRadius: indicatorSize / 2,
                  backgroundColor:
                    index === currentIndex
                      ? indicatorActiveColor
                      : indicatorColor,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
  },
  indicator: {
    marginHorizontal: 4,
  },
});

export default ImageCarousel;
