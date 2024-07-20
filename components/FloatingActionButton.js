import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function FloatingActionButton({ onPress }) {
    return (
        <View style={styles.container}>
            <FAB
                color="#6200ee"
                onPress={onPress}
                icon={<Icon name="plus" size={24} color="white" />}
                buttonStyle={styles.fab}
                size="large"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 1000
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: '#333'
    },
})
