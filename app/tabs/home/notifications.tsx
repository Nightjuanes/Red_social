import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Notifications() {
    return (
        <View style={styles.container}>

            <View style={styles.messageContainer}>
                <Text style={styles.message}>No tienes ninguna notificacion.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    messageContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,   
    },
    message: {
        fontSize: 16,
        color: '#333',
    },
});
