import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const MarqueeText = ({ text, duration = 10000 }) => {
  const [textWidth, setTextWidth] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const containerWidth = screenWidth - 20; // Adjust as needed

  useEffect(() => {
    // If textWidth is available, start the animation
    if (textWidth > 0) {
      const totalWidth = textWidth + containerWidth;

      Animated.loop(
        Animated.sequence([
          Animated.timing(scrollX, {
            toValue: -textWidth,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(scrollX, {
            toValue: containerWidth,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [duration, scrollX, textWidth, containerWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.marqueeContent,
          {
            width: textWidth + containerWidth, // Set width for seamless scrolling
            transform: [{ translateX: scrollX }],
          },
        ]}
      >
        <Text
          style={styles.text}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            if (textWidth === 0) {
              setTextWidth(width);
            }
          }}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%', // Adjust as needed
    height: 20, // Adjust height to fit your needs
    justifyContent: 'center',
  },
  marqueeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MarqueeText;
