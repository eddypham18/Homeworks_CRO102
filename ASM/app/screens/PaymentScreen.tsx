import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import InputUnderlined from '../components/InputUnderlined';
import AppHeader from '../components/AppHeader';
import api from '../configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const PaymentScreen: React.FC<any> = ({ navigation, route }) => {
  const total = route?.params?.total || 0;
  const cartId = route?.params?.cartId || '';
  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<number>(1);
  const [payMethod, setPayMethod] = useState<number>(1);

  // Fetch thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await api.get(`/users/${userId}`);
          setUser(response.data);
          setPhoneNumber(response.data.phone || '');
          setAddress(response.data.address || '');
        }
      } catch (error) {
        console.log('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const goToAfterPayment = () => {
    if (!phoneNumber || !address) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      setError('Số điện thoại không hợp lệ!');
      return;
    }

    // chuyển sang màn hình AfterPayment
    navigation.navigate('AfterPayment', {
      total,
      user: user,
      deliveryMethod,
      payMethod,
      cartId,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <AppHeader navigation={navigation} title={'THANH TOÁN'} />
        <View style={{ marginTop: 10 }}>
          <Text
            style={[
              styles.textUnderlined,
              { color: 'black', fontWeight: 'bold', marginBottom: 5 },
            ]}
          >
            Thông tin khách hàng
          </Text>
          <InputUnderlined editable={false} value={user.name} />
          <InputUnderlined editable={false} value={user.email} />
          <InputUnderlined
            placeholder={'Nhập số điện thoại'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <InputUnderlined
            placeholder={'Nhập địa chỉ'}
            value={address}
            onChangeText={setAddress}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={{ marginTop: 30 }}>
          <Text
            style={[
              styles.textUnderlined,
              { color: 'black', fontWeight: 'bold' },
            ]}
          >
            Phương thức vận chuyển
          </Text>
          <TouchableOpacity
            onPress={() => setDeliveryMethod(1)}
            style={{ marginBottom: 10 }}
          >
            <Text
              style={[
                styles.giaoHang,
                deliveryMethod === 1 ? { color: 'green' } : { color: 'black' },
              ]}
            >
              Giao hàng Nhanh - 15.000đ
            </Text>
            <Text style={styles.textUnderlined}>
              Dự kiến giao hàng 3 - 5 ngày
            </Text>
            {deliveryMethod === 1 && (
              <Image
                style={styles.checkIcon}
                source={require('../../assets/images/check.png')}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeliveryMethod(2)}
            style={{ marginBottom: 10 }}
          >
            <Text
              style={[
                styles.giaoHang,
                deliveryMethod === 2 ? { color: 'green' } : { color: 'black' },
              ]}
            >
              Giao hàng COD - 20.000đ
            </Text>
            <Text style={styles.textUnderlined}>
              Dự kiến giao hàng 1 - 3 ngày
            </Text>
            {deliveryMethod === 2 && (
              <Image
                style={styles.checkIcon}
                source={require('../../assets/images/check.png')}
              />
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text
              style={[
                styles.textUnderlined,
                { color: 'black', fontWeight: 'bold' },
              ]}
            >
              Hình thức thanh toán
            </Text>
            <TouchableOpacity
              onPress={() => setPayMethod(1)}
              style={{ marginBottom: 10 }}
            >
              <Text
                style={[
                  styles.textUnderlined,
                  payMethod === 1 ? { color: 'green' } : { color: 'black' },
                ]}
              >
                Thẻ VISA/MASTERCARD
              </Text>
              {payMethod === 1 && (
                <Image
                  style={styles.checkIconPaymethod}
                  source={require('../../assets/images/check.png')}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPayMethod(2)}>
              <Text
                style={[
                  styles.textUnderlined,
                  payMethod === 2 ? { color: 'green' } : { color: 'black' },
                ]}
              >
                Thẻ ATM
              </Text>
              {payMethod === 2 && (
                <Image
                  style={styles.checkIconPaymethod}
                  source={require('../../assets/images/check.png')}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            <View style={styles.boxBottom}>
              <Text style={styles.subtitle}>Tạm tính</Text>
              <Text style={[styles.subtitle, { color: 'black' }]}>
                {total.toLocaleString('de-DE')}đ
              </Text>
            </View>
            <View style={styles.boxBottom}>
              <Text style={styles.subtitle}>Phí vận chuyển</Text>
              <Text style={[styles.subtitle, { color: 'black' }]}>
                {deliveryMethod === 1 ? '15.000' : '20.000'}đ
              </Text>
            </View>
            <View style={styles.boxBottom}>
              <Text style={styles.subtitle}>Tổng cộng</Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: 'green', fontWeight: 'bold' },
                ]}
              >
                {(
                  total + (deliveryMethod === 1 ? 15000 : 20000)
                ).toLocaleString('de-DE')}{' '}
                đ
              </Text>
            </View>
          </View>

          {/* Nút Thanh Toán */}
          <TouchableOpacity
            style={[
              styles.button,
              phoneNumber && address
                ? { backgroundColor: 'green' }
                : { backgroundColor: 'gray' },
            ]}
            onPress={goToAfterPayment}
          >
            <Text style={styles.buttonText}>TIẾP TỤC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  error: {
    fontWeight: '600',
    fontSize: 16,
    color: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 14,
  },
  boxBottom: {
    marginHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textUnderlined: {
    fontSize: 16,
    color: 'gray',
    borderBottomColor: 'gray',
    paddingBottom: 5,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  checkIconPaymethod: {
    position: 'absolute',
    right: 10,
  },
  giaoHang: {
    fontSize: 16,
    fontWeight: '400',
  },
  backIcon: {
    marginLeft: -20,
  },
  title: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: '500',
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
