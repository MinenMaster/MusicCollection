import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import RecommendedSongs from '../../../components/RecommendedSongs'
import { useIsFocused } from '@react-navigation/native';

export default function Page() {
    const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Songs</Text>
      <RecommendedSongs />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
