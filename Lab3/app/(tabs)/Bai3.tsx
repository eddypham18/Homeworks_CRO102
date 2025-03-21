import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
const HEADER_HEIGHT = 220;
const AVATAR_SIZE = 60;
const MIN_AVATAR_SIZE = 0;
const MIN_HEADER_HEIGHT = 0;
const categories = ['Popular', 'Product Design', 'Development', 'Project'];
const quizzes = [
  {
    id: '1',
    category: 'Product Design',
    title: 'Design System',
    author: 'Brandon',
    count: 10,
  },
  {
    id: '2',
    category: 'Development',
    title: 'React Native 101',
    author: 'Jennifer',
    count: 16,
  },
  {
    id: '3',
    category: 'Product Design',
    title: 'Design System',
    author: 'Brandon',
    count: 10,
  },
  {
    id: '4',
    category: 'Development',
    title: 'React Native 101',
    author: 'Jennifer',
    count: 16,
  },
  {
    id: '5',
    category: 'Product Design',
    title: 'Design System',
    author: 'Brandon',
    count: 10,
  },
  {
    id: '6',
    category: 'Development',
    title: 'React Native 101',
    author: 'Jennifer',
    count: 16,
  },
];

const Bai3 = () => {
  const scrollY = useSharedValue(10);

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [HEADER_HEIGHT, MIN_HEADER_HEIGHT]
        ),
        { duration: 50 }
      ),
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 200], [1, 0]), // Opacity từ 1 -> 0 khi cuộn từ 0px -> 200px
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 200], [1, 0.8]), // Thu nhỏ Text khi cuộn
        },
      ],
    };
  });

  const avatarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(
        interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [AVATAR_SIZE, MIN_AVATAR_SIZE]
        ),
        { duration: 100 }
      ),
      height: withTiming(
        interpolate(
          scrollY.value,
          [0, HEADER_HEIGHT],
          [AVATAR_SIZE, MIN_AVATAR_SIZE]
        ),
        { duration: 100 }
      ),
      opacity: withTiming(
        interpolate(scrollY.value, [0, HEADER_HEIGHT], [1, 0.5]),
        { duration: 100 }
      ),
    };
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
          style={[styles.avatar, avatarStyle]}
        />
        <Animated.Text style={[styles.greeting, animatedTextStyle]}>
          Mornin' Mark!{'\n'}Ready for a quiz?
        </Animated.Text>
        {/* Categories */}
      </Animated.View>
      <View style={styles.categoryContainer}>
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.category, index === 0 && styles.categoryActive]}
          >
            <Text
              style={[
                styles.categoryText,
                index === 0 && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Popular Quizzes */}
      <Text style={styles.sectionTitle}>Popular Quizzes</Text>
      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        style={{ backgroundColor: 'rgba(231, 231, 231, 0.73)' }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        renderItem={({ item }) => (
          <View style={styles.quizCard}>
            <View>
              <Text style={styles.quizCategory}>{item.category}</Text>
              <Text style={styles.quizTitle}>{item.title}</Text>
              <Text style={styles.quizAuthor}>👤 {item.author}</Text>
            </View>
            <View style={styles.quizCount}>
              <Text style={styles.quizCountText}>Q {item.count}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    backgroundColor: '#00D563',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'column',
    height: 300,
    justifyContent: 'center',
  },
  avatar: { width: 100, height: 100, borderRadius: 25, marginRight: 10 },
  greeting: { color: '#FFF', fontSize: 22, fontWeight: 'bold', flex: 1 },

  categoryContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#00D563',
  },
  category: { padding: 10, marginRight: 10, borderRadius: 20 },
  categoryActive: { backgroundColor: '#dbead5', opacity: 0.5 },
  categoryText: { color: '#333', fontSize: 14 },
  categoryTextActive: { color: '#FFF', fontWeight: 'bold' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
  },
  quizCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizCategory: { fontSize: 12, color: '#777' },
  quizTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  quizAuthor: { fontSize: 12, color: '#555' },
  quizCount: { backgroundColor: '#5B72F2', borderRadius: 15, padding: 8 },
  quizCountText: { color: '#FFF', fontWeight: 'bold' },
});

export default Bai3;
