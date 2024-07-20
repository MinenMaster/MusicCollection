import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function PlaylistItem({ playlist }) {
    const router = useRouter(); // Use useRouter hook for navigation

    const handlePress = (playlist) => {
        // Pass only the playlist name or an ID
        router.push(`/playlists/PlaylistDetail?playlistName=${encodeURIComponent(playlist.name)}`);
    };

    return (
        <TouchableOpacity style={styles.playlist} onPress={handlePress}>
            <Text style={styles.title}>{playlist.name}</Text>
            <Text style={styles.count}>{playlist.songs.length} songs</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    playlist: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    count: {
        fontSize: 14,
        color: '#666',
    },
});
