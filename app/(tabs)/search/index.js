import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import Song from '../../../components/Song'
import PreviewPlayer from '../../../components/PreviewPlayer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SearchInputWithSvg from '../../../components/SearchInputWithSvg';
import { useIsFocused } from '@react-navigation/native';

export default function Page() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [previewUrl, setPreviewUrl] = useState(null)

    const isFocused = useIsFocused();

    const handleSongPress = (song) => {
        setPreviewUrl(song.preview)
    }

    const handlePreviewEnd = () => {
        setPreviewUrl(null)
    }

    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await AsyncStorage.getItem('Favorites')
            if (favorites) {
                const favoriteIds = JSON.parse(favorites)
                console.log('Favorite IDs:', favoriteIds)
            }
        }
        loadFavorites()
    }, [isFocused])

    useEffect(() => {
        const search = async () => {
            try {
                const response = await fetch(`https://api.deezer.com/search?q=${query}`)
                const data = await response.json()
                setResults(data.data)
            } catch (error) {
                console.error("Error fetching search results: ", error)
            }
        }
        search();
    }, [query])

    return (
        <View style={styles.container}>
            <SearchInputWithSvg value={query} onChangeText={setQuery} placeholder="Search for artists or songs" />
            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Song
                        id={item.id}
                        title={item.title}
                        artist={item.artist.name}
                        image={item.album.cover}
                        onPress={() => handleSongPress(item)}
                    />
                )}
            />
            {previewUrl && <PreviewPlayer previewUrl={previewUrl} onEnd={handlePreviewEnd} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        marginBottom: 16,
    },
})
