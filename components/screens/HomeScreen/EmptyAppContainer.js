/* eslint-disable prettier/prettier */
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
const windowHeight = Dimensions.get('window').height/100*80;
export default function EmptyAppContainer(){
    return(
        <View style={styles.container}>
            <Image source={require("../../../assets/images/homeScreenSadFace.png")} style={styles.img}/>
            <View>
            <Text style={styles.upperText}>Oops... </Text>
            <Text style={styles.upperText}>There is nothing we can show.</Text>
            </View>
            <Text style={styles.lowerText}>Once you create your first app limit, your screen time statistics will be displayed here.</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: windowHeight,
        paddingHorizontal: 70,
        gap: 10,
    },
    upperText: {
        fontWeight: '700',
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    lowerText: {
        color: 'rgba(148, 163, 228, 1)',
        lineHeight: 17,
        fontSize: 15,
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
})