import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import React, { useContext, useState } from 'react';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AutContext';


export default function Signin() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = async () => {
        try {
            await login(email, password);
            router.push('/tabs/home');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Conecti</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Sign in"
                onPress={handleSignin}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#C0C0C0',
    },
    link: {
        marginTop: 20,
        width: '100%',
        borderRadius: 100,
        backgroundColor: '#007AFF',
        padding: 10,
        textAlign: 'center',
    },
    linkText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        borderRadius: 100,
        backgroundColor: '#007AFF',
        padding: 10,
        width: '100%',
        marginTop: 20,
    },
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        fontFamily: 'Helvetica',
    },
});
