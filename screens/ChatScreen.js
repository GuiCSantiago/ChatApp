import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
    const { username, identificador } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!identificador) {
            console.error('Identificador is undefined');
            return;
        }

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:8082/consultaMensagens?identificadorUsuario=${identificador}`);
                console.log('API Response:', response); // Log the entire response to debug
                if (response?.data && Array.isArray(response.data)) {
                    const validMessages = response.data.map((msg, index) => ({
                        ...msg,
                        MsgId: msg.MsgId || index // Use index as a fallback if MsgId is missing
                    }));
                    setMessages(validMessages);
                } else {
                    console.error('Unexpected API response format:', response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);

        return () => clearInterval(intervalId);
    }, [identificador]);

    const handleSendMessage = async () => {
        if (message.trim() && identificador) {
            try {
                await axios.post(`http://10.0.2.2:8082/msgAll`, {
                    identificadorUsuario: identificador,
                    msg: message
                });
                setMessage('');
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        } else {
            console.error('Message is empty or identificador is undefined');
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.MsgId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageBox}>
                        <Text style={styles.messageText}>{item.msg}</Text>
                        <Text style={styles.senderText}>{item.identificadorUsuarioRemetente === identificador ? 'You' : 'Other'}</Text>
                    </View>
                )}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite uma mensagem"
                    value={message}
                    onChangeText={setMessage}
                />
                <Button title="Enviar" onPress={handleSendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    messageList: {
        flex: 1
    },
    messageBox: {
        padding: 10,
        margin: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5
    },
    messageText: {
        fontSize: 16
    },
    senderText: {
        fontSize: 12,
        alignSelf: 'flex-end'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#ffffff'
    }
});

export default ChatScreen;