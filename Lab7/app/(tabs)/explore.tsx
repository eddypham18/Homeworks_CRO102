import React, { useState, useEffect } from 'react';
import { Button, Alert, View, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth } from '../../firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function TabTwoScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
    androidClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
    iosClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
    webClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (!response) return;

    const handleSignInWithGoogle = async () => {
      try {
        if (response.type === 'success') {
          setIsLoading(true);
          // Kiểm tra xem có id_token hay không
          if (!response.params?.id_token) {
            throw new Error('Không nhận được token từ Google');
          }

          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          await signInWithCredential(auth, credential);
          Alert.alert('Đăng nhập Google thành công!');
        } else if (response.type === 'error') {
          console.error('Google Sign In Error:', response.error);
          Alert.alert(
            'Lỗi đăng nhập Google',
            response.error?.message || 'Đã xảy ra lỗi khi đăng nhập'
          );
        } else if (response.type === 'cancel') {
          console.log('Google Sign In Cancelled');
        }
      } catch (error) {
        console.error('Firebase Auth Error:', error);
        Alert.alert(
          'Lỗi xác thực Firebase',
          error instanceof Error ? error.message : 'Lỗi không xác định'
        );
      } finally {
        setIsLoading(false);
      }
    };

    handleSignInWithGoogle();
  }, [response]);

  // Xử lý cải thiện quá trình đăng nhập
  const onGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      // Thêm timeout để đảm bảo promptAsync không bị treo
      const authPromise = promptAsync();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout đăng nhập')), 30000)
      );

      await Promise.race([authPromise, timeoutPromise]);
    } catch (error) {
      console.error('Google Sign In Prompt Error:', error);
      Alert.alert(
        'Lỗi khởi động đăng nhập',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
      setIsLoading(false);
    }
  };

  const onGoogleSignOut = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
      Alert.alert('Đăng xuất Google thành công!');
    } catch (error) {
      console.error('Sign Out Error:', error);
      Alert.alert(
        'Lỗi khi đăng xuất',
        error instanceof Error ? error.message : 'Lỗi không xác định'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Đăng nhập bằng Google"
        onPress={onGoogleSignIn}
        disabled={isLoading}
      />
      <View style={styles.space} />
      <Button
        title="Đăng xuất Google"
        onPress={onGoogleSignOut}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  space: {
    height: 16,
  },
});
