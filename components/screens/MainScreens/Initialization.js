import {Image, StyleSheet, Text, View, Pressable} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';

export default function Start({onPress}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#524E8D', '#6F3A3A']}
        style={styles.background}
      />
      <Image
        source={require('../../../assets/images/stars.png')}
        style={styles.logoStars}
        resizeMode="cover"
      />
      <View style={styles.main}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Image
          source={require('../../../assets/images/logoName.png')}
          style={styles.logoName}
        />
      </View>
      <Text style={styles.text1}>
        Start being more productive by limiting screen time and enjoying life
        without distractions
      </Text>
      <View style={styles.bottomblock}>
        <Text style={styles.h1}>Welcome!</Text>
        <Text style={styles.h1text}>
          Click on the button below to begin your journey aboard
        </Text>
        <Pressable onPress={onPress} style={({ pressed }) => [
    styles.button,
    {
      backgroundColor: pressed ? '#E8E8E8' : '#354171',
      borderWidth: pressed ? 2 : 0,
      borderColor: '#354171',
    },
  ]}>
  {({ pressed }) => (
    <Text style={[styles.buttonText, { color: pressed ? '#354171' : '#E8E8E8' }]}>
      GET STARTED
    </Text>
  )}
        </Pressable>
        <Image
          source={require('../../../assets/images/leftcircles.png')}
          style={styles.leftcircles}
        />
        <Image
          source={require('../../../assets/images/rightcircles.png')}
          style={styles.rightcircles}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  rightcircles: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  leftcircles: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  logo: {
    width: 227,
    height: 96,
    marginTop: 151,
    alignSelf: 'center',
  },
  logoStars: {
    width: 135,
    height: 132,
    position: 'absolute',
    right: 8.5,
  },
  logoName: {
    alignSelf: 'center',
    marginLeft: 4,
    marginTop: 11,
  },
  text1: {
    fontFamily: 'Roboto-Regular',
    color: '#E8E8E8',
    textAlign: 'center',
    width: 325,
    marginTop: 49,
    marginRight: 18,
    marginLeft: 17,
    marginBottom: 50,
  },
  bottomblock: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    width: '100%',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  h1: {
    color: '#354171',
    fontFamily: 'Roboto-Bold',
    fontSize: 48,
    textAlign: 'center',
    paddingTop: 30,
  },
  h1text: {
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginLeft: 50,
    marginRight: 50,
    marginTop: 20,
    marginBottom: 20,
    color: '#354171',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#354171',
    width: 304,
    alignSelf: 'center',
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  buttonText: {
    fontFamily: 'Roboto-Bold',
    color: '#E8E8E8',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 18,
    paddingTop: 18,
    paddingLeft: 90,
    paddingRight: 90,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 800,
  },
});
