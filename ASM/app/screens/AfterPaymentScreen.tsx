import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import InputUnderlined from '../components/InputUnderlined';
import api from '../configs/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface AfterPaymentProps {
  navigation: any;
  route: {
    params: {
      total: number;
      user: User;
      deliveryMethod: number;
      payMethod: number;
      cartId: string;
    };
  };
}

const AfterPayment = ({ navigation, route }: AfterPaymentProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Nhận các tham số được truyền từ màn hình Payment
  const { total, user, deliveryMethod, payMethod, cartId } = route.params;

  // State cho thẻ VISA/MASTER
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiry, setExpiry] = useState<string>(''); // MM/YY
  const [cvv, setCvv] = useState<string>('');

  // State cho thẻ ATM
  const [atmNumber, setAtmNumber] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');

  const [error, setError] = useState<string>('');

  // Tính phí vận chuyển
  const shippingFee = deliveryMethod === 1 ? 15000 : 20000;

  // Hàm kiểm tra logic thẻ VISA/MASTERCARD
  const validateCardVisaMaster = () => {
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(cardNumber)) {
      setError('Số thẻ VISA/MASTER phải gồm 16 chữ số');
      return false;
    }

    if (!cardName.trim()) {
      setError('Vui lòng nhập Tên chủ thẻ');
      return false;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiry)) {
      setError('Ngày hết hạn không hợp lệ. Định dạng MM/YY');
      return false;
    }

    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
      setError('CVV không hợp lệ (3 hoặc 4 chữ số)');
      return false;
    }

    return true;
  };

  const validateCardATM = () => {
    const atmRegex = /^[0-9]{12,19}$/;
    if (!atmRegex.test(atmNumber)) {
      setError('Số thẻ ATM phải từ 12 đến 19 chữ số');
      return false;
    }

    if (!bankName.trim()) {
      setError('Vui lòng nhập tên Ngân hàng');
      return false;
    }
    return true;
  };

  // Hàm xử lý khi nhấn nút Xác nhận
  const handleConfirm = () => {
    setError('');

    if (payMethod === 1) {
      if (!validateCardVisaMaster()) {
        return;
      }
    }

    if (payMethod === 2) {
      if (!validateCardATM()) {
        return;
      }
    }

    setModalVisible(true);
  };

  const renderDeliveryMethod = () => {
    if (deliveryMethod === 1) {
      return 'Giao hàng Nhanh - 15.000đ (Dự kiến 3 - 5 ngày)';
    } else {
      return 'Giao hàng COD - 20.000đ (Dự kiến 1 - 2 ngày)';
    }
  };

  // Hàm xử lý khi nhấn nút Đồng ý trong Modal
  const handlePayment = async () => {
    setModalVisible(false);
    navigation.navigate('PaymentSuccess', {
      user,
      payMethod,
      total,
      deliveryMethod,
      cartId,
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} title={'THANH TOÁN'} />
      <ScrollView>
        <View style={{ marginTop: 10 }} />
        {payMethod === 1 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>
              Nhập thông tin thẻ VISA/MASTER
            </Text>
            <InputUnderlined
              placeholder="Nhập số thẻ (16 chữ số)"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <InputUnderlined
              placeholder="Tên chủ thẻ"
              value={cardName}
              onChangeText={setCardName}
            />
            <InputUnderlined
              placeholder="Ngày hết hạn (MM/YY)"
              value={expiry}
              onChangeText={setExpiry}
              keyboardType="numeric"
            />
            <View>
              <InputUnderlined
                placeholder="CVV"
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                width={200}
              />
              <Image
                style={styles.infoIcon}
                source={require('../../assets/images/infoIcon.png')}
              />
            </View>
          </View>
        )}

        {/* Nếu payMethod = 2 -> Form ATM */}
        {payMethod === 2 && (
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Nhập thông tin thẻ ATM</Text>
            <InputUnderlined
              placeholder="Nhập số thẻ ATM"
              keyboardType="numeric"
              value={atmNumber}
              onChangeText={setAtmNumber}
            />
            <InputUnderlined
              placeholder="Tên Ngân hàng"
              value={bankName}
              onChangeText={setBankName}
            />
          </View>
        )}
        {/* Hiển thị lỗi nếu có */}
        {error ? <Text style={styles.error}>{error}</Text> : null}
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

        {/* Tạm tính + Phí vận chuyển + Tổng cộng */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Tạm tính</Text>
            <Text style={styles.value}>{total.toLocaleString('de-DE')}đ</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Phí vận chuyển</Text>
            <Text style={styles.value}>
              {shippingFee.toLocaleString('de-DE')}đ
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Tổng cộng</Text>
            <Text
              style={[styles.value, { color: 'green', fontWeight: 'bold' }]}
            >
              {(total + shippingFee).toLocaleString('de-DE')}đ
            </Text>
          </View>
        </View>

        {/* Nút xác nhận */}
        <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirm}>
          <Text style={styles.btnConfirmText}>XÁC NHẬN</Text>
        </TouchableOpacity>

        {/* Modal xác nhận xóa toàn bộ */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận thanh toán?</Text>
              <Pressable style={styles.modalButton} onPress={handlePayment}>
                <Text style={styles.modalButtonText}>Đồng ý</Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Hủy bỏ</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default AfterPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardSection: {
    marginBottom: 20,
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
  infoText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 16,
  },
  btnConfirm: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoIcon: {
    position: 'absolute',
    right: 180,
    top: 12,
  },
  // Modal
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
    marginBottom: 30,
    marginTop: 10,
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
