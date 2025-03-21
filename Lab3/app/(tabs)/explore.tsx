import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ViewToken } from 'react-native';

interface DataItem {
  id: string;
  title: string;
}

interface ListItemProps {
  item: DataItem;
  viewableItems: { value: ViewToken[] };
}

const data: DataItem[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 1' },
  { id: '6', title: 'Item 2' },
  { id: '7', title: 'Item 3' },
  { id: '8', title: 'Item 4' },
  { id: '9', title: 'Item 4' },
  { id: '10', title: 'Item 4' },
  { id: '11', title: 'Item 4' },
  { id: '12', title: 'Item 4' },
  { id: '13', title: 'Item 4' },
];

export default function TabTwoScreen() {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
    [viewableItems]
  );

  return (
    <View style={styles.container}>
      <Text>Bai 2</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }: ListRenderItemInfo<DataItem>) => (
          <ListItem item={item} viewableItems={viewableItems} />
        )}
      />
    </View>
  );
}

const ListItem: React.FC<ListItemProps> = React.memo(
  ({ item, viewableItems }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const isVisible = viewableItems.value.some(
        (viewableItem) =>
          viewableItem.item.id === item.id && viewableItem.isViewable
      );
      return {
        opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
        transform: [
          { scale: withTiming(isVisible ? 1 : 0.6, { duration: 300 }) },
        ],
      };
    }, []);

    return (
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.text}>{item.title}</Text>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    height: 100,
    marginVertical: 8,
    backgroundColor: '#4fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});
