import React, { useState, useMemo, memo } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import Item from '../components/Item';

interface ItemType {
  id: string;
  name: string;
  price: string;
  images: string[];
  size: string;
  quantity: number;
  origin: string;
  character?: string;
  new?: boolean;
  type: string;
}

const ListProduct = (props: any) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const { navigation } = props;

  const goToDetail = (id: string) => {
    navigation.navigate('Details', { id });
  };

  // Lấy products từ params
  const products: ItemType[] = props?.route?.params?.products || [];

  // Dùng useMemo để lọc danh sách sản phẩm
  const filteredProducts = useMemo(() => {
    switch (selectedCategory) {
      case 1:
        return products;
      case 2:
        return products.filter((item) => item.new === true);
      case 3:
        return products.filter(
          (item) => item.character && item.character.toLowerCase() === 'ưa bóng'
        );
      case 4:
        return products.filter(
          (item) => item.character && item.character.toLowerCase() === 'ưa sáng'
        );
      default:
        return products;
    }
  }, [selectedCategory, products]);

  const categoryData = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Hàng mới về' },
    { id: 3, name: 'Ưa bóng' },
    { id: 4, name: 'Ưa sáng' },
  ];

  // Bọc Item trong React.memo để tránh re-render không cần thiết
  const MemoizedItem = memo(({ item }: { item: ItemType }) => {
    return <Item item={item} goToDetail={goToDetail} />;
  });

  const renderItem = ({ item }: { item: ItemType }) => {
    return <MemoizedItem item={item} />;
  };

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        title={products[0]?.type ? products[0].type.toUpperCase() : 'SẢN PHẨM'}
        cart={true}
      />

      {/* Danh mục lọc */}
      {products[0]?.type === 'plant' && (
        <View style={styles.listCategory}>
          <FlatList
            data={categoryData}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id.toString()}
                onPress={() => setSelectedCategory(item.id)}
                style={[
                  styles.categoryButton,
                  selectedCategory === item.id && { backgroundColor: 'green' },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.id && { color: '#fff' },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.productListContainer}
      />
    </View>
  );
};

export default ListProduct;

const styles = StyleSheet.create({
  listCategory: {
    paddingLeft: 17,
    marginBottom: 15,
    marginTop: 5,
  },
  container: {
    paddingTop: 20,
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  productListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  categoryButton: {
    marginHorizontal: 10,
    height: 28,
    padding: 5,
    marginBottom: 20,
    borderRadius: 4,
  },
  categoryText: {
    color: '#7D7B7B',
    fontSize: 14,
  },
});
