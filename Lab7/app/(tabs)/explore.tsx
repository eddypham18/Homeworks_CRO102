// GoogleAuth.js
import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase.js';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'https://auth.expo.io/@eddypham18/lab7',
    iosClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
    androidClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com',
    webClientId:
      '120719724876-024lpkvj325ep0sov5b1636f13e1j22j.apps.googleusercontent.com', 
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(
        authentication.idToken,
        authentication.accessToken
      );
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('User signed in:', userCredential.user);
        })
        .catch((error) => {
          console.error('Error during Firebase sign-in:', error);
        });
    }
  }, [response]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully');
      })
      .catch((error) => {
        console.error('Error during sign-out:', error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Đăng nhập bằng Google"
        onPress={() => {
          promptAsync();
        }}
      />
      <Button
        title="Đăng xuất"
        onPress={handleSignOut}
        style={{ marginTop: 16 }}
      />
    </View>
  );
}
