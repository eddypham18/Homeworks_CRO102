import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const AppHeader = ({ navigation, title, cart }: any) => {
  // Navigation
  const goBack = () => {
    navigation.goBack();
  };

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={goBack}>
        <Image
          style={styles.backIcon}
          source={require('../../assets/images/backIcon.png')}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {cart ? (
        <TouchableOpacity onPress={goToCart}>
          <Image
            style={styles.backIcon}
            source={require('../../assets/images/cartIcon.png')}
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backIcon: {
    marginLeft: -10,
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Poppins',
  },
});
