import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingActionButton from '../../../components/FloatingActionButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLocalSearchParams } from 'expo-router';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

export default function PlaylistDetail() {
    const { playlistName } = useLocalSearchParams();
    const [songs, setSongs] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const loadPlaylistAndFavorites = async () => {
            try {
                // Fetch playlist details from AsyncStorage
                const playlistJson = await AsyncStorage.getItem(playlistName);
                const playlist = playlistJson ? JSON.parse(playlistJson) : { songs: [] };
                setSongs(playlist.songs);

                // Fetch favorite songs
                const favoriteSongs = await AsyncStorage.getItem('Favorites');
                setFavorites(favoriteSongs ? JSON.parse(favoriteSongs) : []);
            } catch (error) {
                console.error('Error loading playlist or favorites:', error);
            }
        };

        loadPlaylistAndFavorites();
    }, [playlistName]);

    const removeSong = async (song) => {
        const updatedSongs = songs.filter(item => item !== song);
        setSongs(updatedSongs);
        try {
            await AsyncStorage.setItem(playlistName, JSON.stringify(updatedSongs));
        } catch (error) {
            console.error('Error removing song:', error);
        }
    };

    const addSong = async (song) => {
        const updatedSongs = [...songs, song];
        setSongs(updatedSongs);
        try {
            await AsyncStorage.setItem(playlistName, JSON.stringify(updatedSongs));
        } catch (error) {
            console.error('Error adding song:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={songs}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songText}>{item}</Text>
                        <TouchableOpacity onPress={() => removeSong(item)}>
                            <Icon name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <FloatingActionButton onPress={() => setIsModalVisible(true)} />
            <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add Songs from Favorites</Text>
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <View style={styles.songItem}>
                                <Text style={styles.songText}>{item}</Text>
                                <TouchableOpacity onPress={() => addSong(item)}>
                                    <Icon name="plus" size={20} color="green" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <Button title="Close" onPress={() => setIsModalVisible(false)} buttonStyle={styles.modalButton} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    songItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    songText: {
        fontSize: 16
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 12
    },
    modalButton: {
        marginTop: 10,
        width: '80%',
        alignSelf: 'center'
    }
});
