import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Item from '../components/Item';
import api from '../configs/api';

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
}

const HomeScreen = (props: any) => {
  const [plants, setPlants] = useState<ItemType[]>([]);
  const [plantpots, setPlantpots] = useState<ItemType[]>([]);
  const [accessories, setAccessories] = useState<ItemType[]>([]);

  useEffect(() => {
    api.get('/products?type=plant').then((res: any) => {
      setPlants(res.data);
    });
    api.get('/products?type=plantpot').then((res: any) => {
      setPlantpots(res.data);
    });
    api.get('/products?type=accessory').then((res: any) => {
      setAccessories(res.data);
    });
  }, []);

  const { navigation } = props;

  // Điều hướng
  const goToDetail = (id: string) => {
    navigation.navigate('Details', { id });
  };

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  // Sang màn hình danh sách sản phẩm
  const goToList = (product: any) => {
    navigation.navigate('ListProduct', { products: product });
  };

  // Render item Plant
  const renderItem = ({ item }: { item: ItemType }) => {
    return <Item item={item} goToDetail={goToDetail} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor={'transparent'}
        />
        {/* Header */}
        <View style={styles.headerContainer}>
          <ImageBackground
            style={styles.bgHomeStyle}
            source={require('../../assets/images/backgroundHome.png')}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                Planta - Tỏa sáng không gian nhà bạn
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.subTitle}>Xem hàng mới về</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToCart}>
              <Image
                style={styles.iconCart}
                source={require('../../assets/images/icon_cart.jpg')}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>
        {/* Danh sách sản phẩm */}

        {/* Danh sách Cây trồng */}
        <View style={styles.wrapper}>
          <Text style={styles.category}>Cây trồng</Text>
          <FlatList
            data={plants}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
          <TouchableOpacity style={styles.moreWrapper}>
            <View style={styles.moreLine}>
              <Text
                style={styles.moreText}
                onPress={() => {
                  goToList(plants);
                }}
              >
                Xem thêm Cây trồng
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danh sách Chậu cây trồng */}
        <View style={styles.wrapper}>
          <Text style={styles.category}>Chậu cây trồng</Text>
          <FlatList
            data={plantpots}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
          <TouchableOpacity style={styles.moreWrapper}>
            <View style={styles.moreLine}>
              <Text
                style={styles.moreText}
                onPress={() => {
                  goToList(plantpots);
                }}
              >
                Xem thêm Chậu
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Danh sách Phụ kiện trồng cây */}
        <View style={styles.wrapper}>
          <Text style={styles.category}>Phụ kiện trồng cây</Text>
          <FlatList
            data={accessories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
          />
          <TouchableOpacity style={styles.moreWrapper}>
            <View style={styles.moreLine}>
              <Text
                style={styles.moreText}
                onPress={() => {
                  goToList(accessories);
                }}
              >
                Xem thêm Phụ kiện
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Combo chăm sóc */}
        <View style={styles.comboContainer}>
          <Text style={styles.category}>Combo chăm sóc (mới)</Text>
          <View style={styles.cardContainer}>
            <Text style={styles.comboTitle}>
              Lemon Balm Grow Kit {`\n`}
              <Text style={styles.comboContent}>
                Gồm: hạt giống Lemon Balm,{'\n'}gói đất hữu cơ, chậu Planta,
                {'\n'}
                marker đánh dấu...
              </Text>
            </Text>
            <Image
              style={styles.comboImage}
              source={require('../../assets/images/combo-image.png')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: '#F6F6F6',
    width: '100%',
  },
  bgHomeStyle: {
    width: '100%',
    height: 205,
    marginTop: 113,
  },
  titleContainer: {
    width: 223,
    top: -20,
    left: 25,
    position: 'absolute',
  },
  title: {
    fontSize: 22,
    color: '#221F1F',
    fontFamily: 'Poppins-Regular',
  },
  subTitle: {
    fontSize: 16,
    color: '#007537',
    position: 'absolute',
    top: 75,
    left: 25,
    fontFamily: 'Poppins-Regular',
  },
  iconCart: {
    width: 48,
    height: 46,
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    right: 30,
  },
  wrapper: {
    padding: 24,
  },
  category: {
    fontSize: 22,
    color: '#221F1F',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
  },
  moreWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  moreLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#221F1F',
    marginTop: 20,
  },
  moreText: {
    fontSize: 18,
    color: '#221F1F',
  },
  comboContainer: {
    width: '85%',
    margin: 25,
    justifyContent: 'center',
    alignContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    marginBottom: 100,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    width: '100%',
  },
  comboImage: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: 108,
    height: 134,
  },
  comboTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    padding: 20,
    alignContent: 'center',
  },
  comboContent: {
    fontSize: 14,
    color: '#7D7D7D',
  },
});
