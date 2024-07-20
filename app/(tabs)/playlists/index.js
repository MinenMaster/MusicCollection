import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaylistItem from '../../../components/PlaylistItem';
import { useIsFocused } from '@react-navigation/native';
import FloatingActionButton from '../../../components/FloatingActionButton';
import Modal from 'react-native-modal';
import { Input, Button } from 'react-native-elements';

export default function Page() {
    const [playlists, setPlaylists] = useState([{"name": "Favorites", "songs": []}]);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const isFocused = useIsFocused();

    const loadPlaylists = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const playlistData = await AsyncStorage.multiGet(keys);
            const playlists = playlistData.map(([key, value]) => ({ name: key, songs: JSON.parse(value) }));
            setPlaylists(playlists);
        } catch (error) {
            console.error('Error loading playlists:', error);
        }
    };

    useEffect(() => {
        loadPlaylists();
    }, [isFocused]);

    const createPlaylist = async () => {
        if (!newPlaylistName.trim()) {
            Alert.alert('Error', 'Playlist name cannot be empty.');
            return;
        }

        try {
            const existingPlaylists = playlists.map(pl => pl.name);
            if (existingPlaylists.includes(newPlaylistName)) {
                Alert.alert('Error', 'Playlist already exists.');
                return;
            }

            await AsyncStorage.setItem(newPlaylistName, JSON.stringify([]));
            setPlaylists([...playlists, { name: newPlaylistName, songs: [] }]);
            setNewPlaylistName('');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    const clearAllData = () => {
        function clear() {
            return new Promise(function(resolve, reject) {
                AsyncStorage.getAllKeys()
                    .then(keys => AsyncStorage.multiRemove(keys));
                resolve();
            });
        };
          
        function reset() {
            setPlaylists([{"name": "Favorites", "songs": []}]);
        };
          
        clear().then(reset);
    };

    const logAllData = () => {
        console.log('Deleted -> ', playlists);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={clearAllData}>
                <Text>Clear All Playlists Except Favorites</Text>
            </TouchableOpacity>
            <FlatList
                data={playlists}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <PlaylistItem playlist={item} />
                )}
            />
            <FloatingActionButton onPress={() => setIsModalVisible(true)} />
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Create New Playlist</Text>
                    <Input
                        placeholder="New Playlist Name"
                        value={newPlaylistName}
                        onChangeText={setNewPlaylistName}
                    />
                    <Button title="Create" onPress={createPlaylist} buttonStyle={styles.modalButton} />
                    <Button title="Cancel" onPress={() => setIsModalVisible(false)} buttonStyle={styles.modalButton} />
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
