import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../configs/api';

const SignUpScreen = (props: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorName, setErrorName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errConfirmPassword, setErrorConfirmPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const { navigation } = props;
  const goToLogIn = () => {
    navigation.navigate('Login');
  };

  const handlerRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{6,}$/;

    let valid = true;

    // Kiểm tra họ tên
    if (name.trim() === '') {
      setErrorName('Họ tên không để trống!');
      valid = false;
    } else {
      setErrorName('');
    }

    // Kiểm tra định dạng email
    if (!emailRegex.test(email)) {
      setErrorEmail('Email không đúng định dạng!');
      valid = false;
    } else {
      setErrorEmail('');
    }

    // Kiểm tra định dạng mật khẩu
    if (!passwordRegex.test(password)) {
      setErrorPassword('Password không hợp lệ!');
      valid = false;
    } else {
      setErrorPassword('');
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      setErrorConfirmPassword('Mật khẩu không khớp!');
      valid = false;
    } else {
      setErrorConfirmPassword('');
    }

    if (!valid) return;

    try {
      const checkResponse = await api.get(`/users?email=${email}`);
      if (checkResponse.data && checkResponse.data.length > 0) {
        Alert.alert('Email đã tồn tại', 'Vui lòng sử dụng email khác!');
        return;
      }

      const response = await api.post('/users', {
        name,
        email,
        password,
        phone: '',
        avatar: '',
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Đăng ký thành công!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Đăng ký thất bại', 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi đăng ký',
        error.message || 'Có lỗi xảy ra khi kết nối đến server.'
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image
        style={styles.imageHeader}
        resizeMode="cover"
        source={require('../../assets/images/imageHeader.png')}
      />
      <View style={styles.body}>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtTitle}>Tạo tài khoản</Text>
        <CustomTextInput
          placeHolder="Họ tên"
          onChangeText={setName}
          value={name}
          error={errorName}
        />
        <CustomTextInput
          placeHolder="E-mail"
          onChangeText={setEmail}
          value={email}
          error={errorEmail}
        />
        <CustomTextInput
          eyePassword={true}
          placeHolder="Mật khẩu"
          onChangeText={setPassword}
          value={password}
          error={errorPassword}
        />
        <CustomTextInput
          eyePassword={true}
          placeHolder="Xác nhận mật khẩu"
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          error={errConfirmPassword}
        />

        <View style={styles.moreInfoContainer}>
          <Text style={styles.info}>
            Để đăng ký tài khoản, bạn đồng ý{' '}
            <Text style={styles.colorUnderline}>Terms &</Text>
          </Text>
          <View style={styles.secondRow}>
            <Text style={styles.colorUnderline}>Conditions</Text>
            <Text style={styles.info}> and</Text>
            <Text style={styles.colorUnderline}> Privacy Policy</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#007537', '#4CAF50']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            style={{
              width: '100%',
              height: 40,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handlerRegister}
          >
            <Text style={styles.dangNhapText}>Đăng ký</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.orContainer}>
          <View style={styles.slash}></View>
          <Text style={styles.orText}>Hoặc</Text>
          <View style={styles.slash}></View>
        </View>

        <View style={styles.ggfbContainer}>
          <Image
            source={require('../../assets/images/logoGoogle.png')}
            style={styles.google}
          />
          <Image
            source={require('../../assets/images/logoFacebook.png')}
            style={styles.facebook}
          />
        </View>

        <Text style={styles.askText}>
          Tôi đã có tải khoản
          <Text style={styles.loginText} onPress={goToLogIn}>
            {'  '}Đăng nhập
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  noUnderline: {
    textDecorationLine: 'none',
  },
  colorUnderline: {
    textDecorationLine: 'underline',
    fontSize: 14,
    color: 'green',
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  info: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  moreInfoContainer: {
    marginVertical: 15,
  },
  loginText: {
    color: 'green',
    fontFamily: 'Poppins-Regular',
  },
  askText: {
    color: 'black',
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
  },
  google: {
    marginRight: 30,
  },
  ggfbContainer: {
    marginVertical: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slash: {
    borderBottomWidth: 1,
    borderColor: 'green',
    width: 150,
  },
  orText: {
    marginHorizontal: 5,
    fontFamily: 'Poppins-Regular',
  },
  orContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangNhapText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  linearGradient: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'green',
    width: '100%',
    height: 55,
  },

  body: {
    padding: 20,
  },
  subtTitle: {
    fontSize: 22,
    alignSelf: 'center',
    marginVertical: 10,
    fontFamily: 'Poppins-Regular',
  },
  title: {
    marginTop: -50,
    fontFamily: 'Poppins-Bold',
    fontSize: 35,
    alignSelf: 'center',
  },
  imageHeader: {
    marginTop: -200,
    width: 412,
    height: 400,
  },
  facebook: {
    marginLeft: 30,
    width: 33,
  },
});
