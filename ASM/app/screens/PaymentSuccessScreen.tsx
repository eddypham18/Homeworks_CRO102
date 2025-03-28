import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import api from '../configs/api';
import PaymentItem from '../components/PaymentItem';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface ProductType {
  id: string;
  name: string;
  price: number;
  images: string[];
  size: string;
  origin: string;
  character: string;
  quantityInCart?: number;
}

interface PaymentSuccessProps {
  navigation: any;
  route: {
    params: {
      user: User;
      payMethod: number;
      total: number;
      deliveryMethod: number;
      cartId: string;
    };
  };
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  navigation,
  route,
}) => {
  const { user, payMethod, total, deliveryMethod, cartId } = route.params;

  const [products, setProducts] = useState<ProductType[]>([]);

  // Hàm hiển thị tên phương thức vận chuyển
  const renderDeliveryMethod = () => {
    if (deliveryMethod === 1) {
      return 'Giao hàng Nhanh - 15.000đ\n(Dự kiến giao hàng 3 - 5 ngày)';
    } else {
      return 'Giao hàng COD - 20.000đ\n(Dự kiến giao hàng 1 - 3 ngày)';
    }
  };

  // Hàm hiển thị tên phương thức thanh toán
  const renderPayMethod = () => {
    if (payMethod === 1) return 'Thẻ VISA/MASTERCARD';
    if (payMethod === 2) return 'Thẻ ATM';
    return 'Khác';
  };

  // Lấy dữ liệu sản phẩm trong cart
  const fetchProducts = async () => {
    try {
      const cartResponse = await api.get(`/cart/${cartId}`);
      const { items }: { items: CartItem[] } = cartResponse.data;

      const promises = items.map((item) => api.get(`/products/${item.id}`));
      const responses = await Promise.all(promises);

      const productList: ProductType[] = responses.map((res, index) => ({
        ...res.data,
        quantityInCart: items[index].quantity,
      }));

      setProducts(productList);
    } catch (error) {
      console.log('Error fetching products from cart:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const goToGuide = () => {
    console.log('Chưa làm');
    deleteItemCart();
  };

  const goToHome = () => {
    navigation.navigate('Tab', { screen: 'Home' });
    deleteItemCart();
  };

  //Xóa dữ liệu cart
  const deleteItemCart = async () => {
    try {
      await api.patch(`/cart/${cartId}`, { items: [] });
    } catch (error) {
      console.log('Error deleting cart:', error);
    }
  };

  const renderItem = ({ item }: { item: ProductType }) => {
    return <PaymentItem item={item} onPress={() => {}} />;
  };

  // Dùng ListHeaderComponent để hiển thị phần thông tin khác
  const renderHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.successText}>Bạn đã đặt hàng thành công</Text>

      {/* Thông tin khách hàng */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <Text style={styles.infoText}>{user.name}</Text>
        <Text style={styles.infoText}>{user.email}</Text>
        <Text style={styles.infoText}>{user.phone}</Text>
        <Text style={styles.infoText}>{user.address}</Text>
      </View>

      {/* Phương thức vận chuyển */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
        <Text style={styles.infoText}>{renderDeliveryMethod()}</Text>
      </View>

      {/* Hình thức thanh toán */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
        <Text style={styles.infoText}>{renderPayMethod()}</Text>
      </View>

      {/* Đơn hàng đã chọn */}
      <View style={{ marginBottom: 0 }}>
        <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
      </View>
    </View>
  );

  // Dùng ListFooterComponent để hiển thị nút và thông tin thanh toán
  const renderFooter = () => (
    <View style={styles.buttonContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.infoFooter}>Đã thanh toán</Text>
        <Text style={styles.infoFooter}>{total.toLocaleString('de-DE')}đ</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={goToGuide}>
        <Text style={styles.buttonText}>Xem Cẩm nang trồng cây</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonQuayVe, { marginTop: 10 }]}
        onPress={goToHome}
      >
        <Text style={styles.buttonTextQuayVe}>Quay về Trang chủ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} title={'THÔNG BÁO'} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
      {renderFooter()}
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  successText: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: 'green',
  },
  infoFooter: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
    marginTop: 5,
  },
  button: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'black',
    borderBottomColor: 'gray',
    paddingBottom: 5,
    borderBottomWidth: 1,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 100,
    height: 200,
  },
  buttonQuayVe: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextQuayVe: {
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '400',
    color: 'black',
  },
});
