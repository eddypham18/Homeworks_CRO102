import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../configs/api';

interface CartItem {
  id: string;
  quantity: number;
  select: boolean;
}

interface Product {
  id: string;
  name: string;
  price: string;
  images: string[];
  character?: string;
}

const CartScreen = ({ navigation }: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  // Lấy giỏ hàng của user
  const fetchCart = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await api.get(`/cart?userId=${userId}`);
      if (response.data && response.data.length > 0) {
        setCart(response.data[0].items);
        setCartId(response.data[0].id);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    }
  };

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error);
    }
  };

  // Cập nhật giỏ hàng
  const updateCart = async (updatedCart: CartItem[]) => {
    try {
      await api.patch(`/cart/${cartId}`, { items: updatedCart });
      setCart(updatedCart);
    } catch (error) {
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
    }
  };

  // Toggle chọn/bỏ chọn sản phẩm
  const toggleSelectItem = (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, select: !item.select } : item
    );
    updateCart(updatedCart);
  };

  // Tăng/giảm số lượng
  const handleQuantityChange = (id: string, change: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    updateCart(updatedCart);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  // Xóa toàn bộ đơn hàng
  const handleRemoveAll = async () => {
    try {
      setModalVisible(false);
      await updateCart([]); // cập nhật giỏ hàng rỗng
      ToastAndroid.show('Đã xóa toàn bộ đơn hàng!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Lỗi khi xóa toàn bộ đơn hàng:', error);
    }
  };

  // Tính tổng (chỉ tính những sản phẩm được chọn)
  const total = cart.reduce((sum, item) => {
    if (!item.select) return sum;
    const product = products.find((p) => p.id === item.id);
    if (!product) return sum;
    const price = parseFloat(String(product.price).replace(/\./g, '')) || 0;
    return sum + price * item.quantity;
  }, 0);

  const renderItemCart = ({ item }: { item: CartItem }) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return null;

    return (
      <View style={styles.cartItemContainer}>
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => toggleSelectItem(item.id)}
        >
          <Image
            source={
              item.select
                ? require('../../assets/images/checkCart.png')
                : require('../../assets/images/uncheck.png')
            }
            style={styles.checkbox}
          />
        </TouchableOpacity>

        {/* Hình ảnh sản phẩm */}
        <Image style={styles.imageStyle} source={{ uri: product.images[0] }} />

        <View style={styles.infoContainer}>
          {/* Tên sản phẩm + character */}
          <Text style={styles.productName} numberOfLines={1}>
            {product.name} | {product.character || 'Ưa bóng'}
          </Text>
          {/* Giá */}
          <Text style={styles.productPrice}>
            {product.price.toLocaleString()}đ
          </Text>
          {/* Tăng/giảm số lượng + nút Xóa */}
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/minusSquare.png')}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/plusSquare.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const goToPayment = () => {
    if (!total) {
      ToastAndroid.show('Vui lòng chọn sản phẩm!', ToastAndroid.SHORT);
      return;
    }
    navigation.navigate('Payment', { total, cartId });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backIcon}
            source={require('../../assets/images/backIcon.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
        {cart.length === 0 ? (
          <View />
        ) : (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={styles.deleteIcon}
              source={require('../../assets/images/deleteIcon.png')}
            />
          </TouchableOpacity>
        )}
      </View>

      {cart.length === 0 ? (
        <Text style={styles.nullText}>Giỏ hàng của bạn hiện đang trống</Text>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Danh sách giỏ hàng */}
          <FlatList
            data={cart}
            renderItem={renderItemCart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartListContainer}
          />

          {/* Footer: Tạm tính + nút thanh toán */}
          <View style={styles.footerContainer}>
            <View style={styles.tempPriceContainer}>
              <Text style={styles.tempPriceLabel}>Tạm tính</Text>
              <Text style={styles.tempPriceValue}>
                {total.toLocaleString('de-DE')}đ
              </Text>
            </View>
            <TouchableOpacity style={styles.btnPay} onPress={goToPayment}>
              <Text style={styles.btnPayText}>Tiến hành thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal xác nhận xóa toàn bộ */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận xóa tất cả đơn hàng?</Text>
            <Text style={styles.modalSubtitle}>
              Thao tác này sẽ không thể khôi phục
            </Text>
            <Pressable style={styles.modalButton} onPress={handleRemoveAll}>
              <Text style={styles.modalButtonText}>Đồng ý</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Hủy bỏ</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  nullText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  cartListContainer: {
    paddingVertical: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  imageStyle: {
    width: 65,
    height: 70,
    borderRadius: 8,
    marginHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#007537',
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    color: '#000',
    width: 30,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 20,
    textDecorationLine: 'underline',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  tempPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempPriceLabel: {
    fontSize: 16,
    color: '#000',
  },
  tempPriceValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  btnPay: {
    backgroundColor: '#007537',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  btnPayText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#007537',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
