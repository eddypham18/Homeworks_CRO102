import React from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offset.value }],
    };
  });

  const moveSquare = () => {
    const randomY = Math.random() * (height - 50);
    offset.value = withTiming(randomY, { duration: 500 });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.square, animatedStyle]} />
      <Button title="Move" onPress={moveSquare} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    marginBottom: 20,
    borderRadius: 10,
  },
});
