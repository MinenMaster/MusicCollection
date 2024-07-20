import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import Slider from '@react-native-community/slider'
import { Audio } from 'expo-av'
import Icon from 'react-native-vector-icons/Ionicons'

const PreviewPlayer = ({ previewUrl, onEnd }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [sound, setSound] = useState(null)
    const [duration, setDuration] = useState(0)
    const [position, setPosition] = useState(0)

    useEffect(() => {
        let interval = null

        if (sound && isPlaying) {
            interval = setInterval(async () => {
                const status = await sound.getStatusAsync()
                if (status.isLoaded) {
                    setPosition(status.positionMillis / 1000)
                    setDuration(status.durationMillis / 1000)
                }
            }, 1000)
        } else if (!isPlaying && position !== 0) {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [isPlaying, sound])

    const handlePlayPause = async () => {
        if (sound) {
            const status = await sound.getStatusAsync()
            if (status.isPlaying) {
                await sound.pauseAsync()
                setIsPlaying(false)
            } else {
                await sound.playAsync()
                setIsPlaying(true)
            }
        }
    }

    const handleSliderChange = async (value) => {
        if (sound) {
            await sound.setPositionAsync(value * 1000)
            setPosition(value)
        }
    }

    useEffect(() => {
        const loadSound = async () => {
            const { sound: loadedSound } = await Audio.Sound.createAsync({ uri: previewUrl })
            setSound(loadedSound)
            setIsPlaying(true)
            await loadedSound.playAsync()

            loadedSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    onEnd()
                }
            })
        }

        if (previewUrl) {
            loadSound()
        }

        return () => {
            if (sound) {
                sound.unloadAsync()
            }
        }
    }, [previewUrl])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
                <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#000" />
            </TouchableOpacity>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onValueChange={handleSliderChange}
            />
            <Text style={styles.time}>{Math.floor(position)}s / {Math.floor(duration)}s</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    button: {
        marginRight: 16,
    },
    slider: {
        flex: 1,
    },
    time: {
        marginLeft: 16,
        fontSize: 14,
        color: 'gray',
    },
})

export default PreviewPlayer
