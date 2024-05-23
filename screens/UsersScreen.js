import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

const UsersScreen = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://your-api-url.com/listaUsuarios');
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            Alert.alert('Erro', 'Não foi possível buscar a lista de usuários. Por favor, tente novamente mais tarde.');
        }
    };

    const handleAddUser = async () => {
        if (username.trim()) {
            try {
                const response = await axios.post('http://your-api-url.com/iniciaChat', { usuario: username });
                if (response.data && response.data.identificador) {
                    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
                    setUsername('');
                    fetchUsers(); // Refresh the user list
                } else {
                    Alert.alert('Erro', 'Não foi possível cadastrar o usuário. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                if (error.response && error.response.status === 400) {
                    Alert.alert('Erro', 'Este nome de usuário já está em uso.');
                } else {
                    Alert.alert('Erro', 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
                }
            }
        } else {
            Alert.alert('Erro', 'Por favor, insira um nome de usuário.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lista de Usuários</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.identificador.toString()}
                renderItem={({ item }) => (
                    <View style={styles.userBox}>
                        <Text style={styles.username}>{item.usuario}</Text>
                    </View>
                )}
                style={styles.userList}
            />
            <Text style={styles.title}>Cadastrar Novo Usuário</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu nome de usuário"
                value={username}
                onChangeText={setUsername}
            />
            <Button
                title="Cadastrar"
                onPress={handleAddUser}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    userList: {
        flex: 1,
        marginBottom: 20,
    },
    userBox: {
        padding: 10,
        margin: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5
    },
    username: {
        fontSize: 16
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

export default UsersScreen;