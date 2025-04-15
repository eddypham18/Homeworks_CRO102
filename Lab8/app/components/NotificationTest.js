import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { sendTestNotification } from '../utils/notificationHelper';

export default function NotificationTest() {
    const [title, setTitle] = useState('Test Notification');
    const [body, setBody] = useState('This is a test notification!');
    const [status, setStatus] = useState(null);

    const handleSendNotification = async () => {
        try {
            await sendTestNotification(title, body);
            setStatus('Notification sent successfully!');
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Test Notifications</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Notification Title"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                    style={[styles.input, styles.messageInput]}
                    value={body}
                    onChangeText={setBody}
                    placeholder="Notification Message"
                    multiline
                    numberOfLines={3}
                />
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSendNotification}
            >
                <Text style={styles.buttonText}>Send Test Notification</Text>
            </TouchableOpacity>

            {status && (
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
    },
    messageInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusContainer: {
        marginTop: 15,
        padding: 8,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        color: '#333',
    },
}); 