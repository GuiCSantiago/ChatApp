import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (username.trim()) {
            try {
                const response = await axios.post('http://10.0.2.2:8082/iniciaChat', { usuario: username });
                console.log('Login Response:', response.data); // Log the response data
                if (response.data && response.data.identificador) {
                    navigation.navigate('Chat', { username, identificador: response.data.identificador });
                } else {
                    Alert.alert('Erro de Login', 'Não foi possível obter o identificador. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                if (error.response && error.response.status === 400) {
                    Alert.alert('Erro de Login', 'Este nome de usuário já está em uso.');
                } else {
                    Alert.alert('Erro de Login', 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
                }
            }
        } else {
            Alert.alert('Erro', 'Por favor, insira um nome de usuário.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao Chat</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu nome de usuário"
                value={username}
                onChangeText={setUsername}
            />
            <Button
                title="Login"
                onPress={handleLogin}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
    }
});

export default LoginScreen;