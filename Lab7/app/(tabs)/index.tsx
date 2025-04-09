import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';

interface UserInput {
  email: string;
  password: string;
}

export default function HomeScreen() {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState<UserInput>({
    email: '',
    password: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userState) => {
      setUser(userState);
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, [initializing]);

  // Hàm đăng ký người dùng mới
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        userInput.email,
        userInput.password
      );
      Alert.alert('Tài khoản đã được tạo và đăng nhập');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Email đã tồn tại');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Email không hợp lệ');
      } else {
        Alert.alert('Đăng ký thất bại', error.message);
      }
      console.error(error);
    }
  };

  // Hàm đăng nhập người dùng
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        userInput.email,
        userInput.password
      );
      Alert.alert('Đăng nhập thành công');
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message);
      console.error(error);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký / Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userInput.email}
          onChangeText={(text) => setUserInput({ ...userInput, email: text })}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={userInput.password}
          onChangeText={(text) =>
            setUserInput({ ...userInput, password: text })
          }
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Đăng nhập" onPress={handleSignIn} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Đăng ký" onPress={handleSignUp} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng {user.email}</Text>
      <Button title="Đăng xuất" onPress={() => signOut(auth)} />
      <Text style={{ marginTop: 20 }}>Nhấn vào nút để đăng xuất</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
