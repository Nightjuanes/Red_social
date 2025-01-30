import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import React, { useContext, useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AutContext';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const router = useRouter();``
  const [name , setName] = useState('');
  const [username , setUsername] = useState('');
  const [lastname , setLastname] = useState('');

  const handleSignup = async () => {
    if (password1 !== password2) {
      console.log('Error', 'Passwords do not match');
      
    }

    if (!validateEmail(email)) {
      console.log('Error', 'Invalid email');
      }

    if (!validatePassword(password1)) {
     console.log('Error', 'Password must be at least 6 characters long');
     
    }
    if (!verifyEmail(email)) {
      console.log('Error', 'Invalid email');
      return;
    }
    try {
      await signup(email, password1, name, lastname, username);
      router.push('/singin');

    } catch (error) {
      console.log(error);
    }
  };
  //validar correo 
  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const verifyEmail =(email: string): boolean =>{
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailValido.test(email);
  }

  const validatePassword = (password: string) => {
    return password.length >= 6;

  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />

       <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your Name"
        value={name}
        onChangeText={setName}
      />
       <TextInput
        style={styles.input}
        placeholder="Enter your LastName"
        value={lastname}
        onChangeText={setLastname}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password1}
        onChangeText={setPassword1}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        secureTextEntry
        value={password2}
        onChangeText={setPassword2}
      />
      <Button
        title=" Create account"
        onPress={handleSignup}
      />
           <Button
        title="Go back"
        onPress={() => router.push('/singin')}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
});
