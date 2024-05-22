import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, FlatList, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
    const { username, identificador } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://your-api-url.com/consultaMensagens?identificadorUsuario=${identificador}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                await axios.post(`http://your-api-url.com/msgAll`, {
                    identificadorUsuario: identificador,
                    msg: message
                });
                setMessage('');
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.MsgId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.messageBox}>
                        <Text style={styles.messageText}>{item.Msg}</Text>
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
