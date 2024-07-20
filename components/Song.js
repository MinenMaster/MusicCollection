import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Song = ({ id, title, artist, onPress }) => {
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const favorites = await AsyncStorage.getItem('Favorites')
            const favoritesArray = favorites ? JSON.parse(favorites) : []
            setIsFavorite(favoritesArray.includes(id))
        }
        checkFavoriteStatus()
    }, [id])

    const toggleFavorite = async () => {
        const favorites = await AsyncStorage.getItem('Favorites')
        const favoritesArray = favorites ? JSON.parse(favorites) : []

        if (favoritesArray.includes(id)) {
            const newFavorites = favoritesArray.filter((favId) => favId !== id)
            await AsyncStorage.setItem('Favorites', JSON.stringify(newFavorites))
            setIsFavorite(false)
        } else {
            const newFavorites = [...favoritesArray, id]
            await AsyncStorage.setItem('Favorites', JSON.stringify(newFavorites))
            setIsFavorite(true)
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.artist}>{artist}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                <Icon name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#f00" />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artist: {
        fontSize: 14,
        color: 'gray',
    },
    favoriteButton: {
        marginRight: 16,
    },
})

export default Song
