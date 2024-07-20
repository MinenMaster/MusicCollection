import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Custom TextInput component with SVG placeholder
const SearchInputWithSvg = ({ value, onChangeText, placeholder }) => {
    return (
        <View style={styles.container}>
            {value === '' && (
                <Svg
                    style={styles.svgPlaceholder}
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    {/* Replace the Path below with your SVG's path */}
                    <Path
                        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                        fill="#000"
                    />
                </Svg>
            )}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 32,
        marginBottom: 16,
    },
    input: {
        height: 48,
        paddingLeft: 8,
        fontSize: 16,
    },
});

export default SearchInputWithSvg;