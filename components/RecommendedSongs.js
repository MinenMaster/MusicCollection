import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import PreviewPlayer from './PreviewPlayer';
import MarqueeText from './MarqueeText';

const DEEZER_API_URL = 'https://api.deezer.com';
const { width: screenWidth } = Dimensions.get('window');

const IMAGE_SIZE = 100; // Width and height of the album image
const MAX_TITLE_LENGTH = 15; // Maximum length of title before applying marquee

const RecommendedSongs = () => {
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(null);

  useEffect(() => {
    getFavorites();
    fetchRandomSongs();
  }, []);

  const fetchSongIds = async () => {
    try {
      const response = await fetch(`${DEEZER_API_URL}/search?q=track`);
      const data = await response.json();
      const allSongIds = data.data.map(track => track.id);

      const shuffledIds = allSongIds.sort(() => 0.5 - Math.random());
      return shuffledIds.slice(0, 12);
    } catch (error) {
      console.error('Error fetching song IDs:', error);
      return [];
    }
  };

  const fetchSongDetails = async (ids) => {
    try {
      const requests = ids.map(id => fetch(`${DEEZER_API_URL}/track/${id}`).then(res => res.json()));
      const songsData = await Promise.all(requests);
      setSongs(songsData);
    } catch (error) {
      console.error('Error fetching song details:', error);
    }
  };

  const fetchRandomSongs = async () => {
    const songIds = await fetchSongIds();
    if (songIds.length === 12) {
      fetchSongDetails(songIds);
    } else {
      console.error('Not enough valid song IDs found.');
    }
  };

  const getFavorites = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('Favorites');
      const parsedFavorites = jsonValue != null ? JSON.parse(jsonValue) : [];
      setFavorites(parsedFavorites);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (song) => {
    console.log('Before -> ', favorites);
    let newFavorites = [...favorites];
    if (favorites.includes(song.id)) {
      newFavorites = newFavorites.filter(fav => fav !== song.id);
    } else {
      newFavorites.push(song.id);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    getItemResult = await AsyncStorage.getItem('Favorites');
    console.log('AsyncStorage.getItem -> ', getItemResult);
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('Favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const playPreview = (previewUrl) => {
    setCurrentPreviewUrl(previewUrl);
  };

  const renderSong = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    const imageUrl = `${item.album.cover_medium}?${Date.now()}`;
    const title = item.title;
    const shouldMarquee = title.length > MAX_TITLE_LENGTH;

    return (
      <View style={styles.songContainer}>
        <TouchableOpacity onPress={() => playPreview(item.preview)}>
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.albumImage} 
            onError={() => console.error('Error loading image', imageUrl)}
          />
        </TouchableOpacity>
        <View style={styles.songInfo}>
          {shouldMarquee ? (
            <MarqueeText
              text={title}
              duration={6250}  // Adjust duration for scrolling speed
              style={styles.marqueeText}
            />
          ) : (
            <Text style={styles.songTitle}>{title}</Text>
          )}
          <Text style={styles.songArtists}>{item.artist.name}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "red" : "black"} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderSong}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={styles.row}
      />
      {currentPreviewUrl && (
        <PreviewPlayer 
          previewUrl={currentPreviewUrl}
          onEnd={() => setCurrentPreviewUrl(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  songContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: (screenWidth - 40) / 3, // Adjust width to fit 3 columns
    minHeight: IMAGE_SIZE + 50, // Ensure height includes space for the text
  },
  albumImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  songInfo: {
    alignItems: 'center',
    marginTop: 5,
    width: IMAGE_SIZE, // Match width to image size
    height: 40, // Adjust height for text space
    overflow: 'hidden', // Ensure text does not overflow
  },
  songTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: IMAGE_SIZE, // Ensure text width matches the image width
  },
  marqueeText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    width: IMAGE_SIZE, // Ensure the marquee text width matches the image width
  },
  songArtists: {
    fontSize: 12,
    color: 'grey',
    textAlign: 'center',
    marginTop: 5, // Reduced space between title and artist name
  },
});

export default RecommendedSongs;
