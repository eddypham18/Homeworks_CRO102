import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ScrollView,
    SafeAreaView
} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
    registerForPushNotificationsAsync,
    setupNotificationListeners
} from '../utils/notificationHelper';
import NotificationTest from '../components/NotificationTest';

interface NotificationItem {
    id: string;
    title: string;
    body: string;
    date: string;
    data: any;
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        let cleanupFunction: (() => void) | null = null;

        const setupNotifications = async () => {
            try {
                setIsLoading(true);

                // Register for push notifications
                const token = await registerForPushNotificationsAsync();
                if (isMounted) {
                    setExpoPushToken(token || '');
                }

                // Set up notification listeners
                if (isMounted) {
                    try {
                        const cleanup = setupNotificationListeners((notification: any) => {
                            if (isMounted) {
                                setNotifications(prevNotifications => [
                                    {
                                        id: Date.now().toString(),
                                        title: notification.request.content.title,
                                        body: notification.request.content.body,
                                        date: new Date().toLocaleString(),
                                        data: notification.request.content.data
                                    },
                                    ...prevNotifications
                                ]);
                            }
                        });

                        cleanupFunction = cleanup;
                    } catch (listenerError) {
                        console.error('Error setting up notification listeners:', listenerError);
                        if (isMounted) {
                            setError('Error setting up notification listeners');
                        }
                    }
                }
            } catch (err) {
                console.error('Error in notification setup:', err);
                if (isMounted) {
                    setError('Failed to set up notifications');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        setupNotifications();

        // Clean up on unmount
        return () => {
            isMounted = false;
            if (cleanupFunction) {
                cleanupFunction();
            }
        };
    }, []);

    const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
        <View style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
            <Text style={styles.notificationDate}>{item.date}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>Notifications</Text>

                <NotificationTest />

                <View style={styles.notificationListContainer}>
                    <Text style={styles.sectionTitle}>Recent Notifications</Text>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : notifications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {isLoading ? 'Loading notifications...' : 'No notifications yet'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            renderItem={renderNotificationItem}
                            style={styles.list}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        paddingTop: 40,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 20,
    },
    notificationListContainer: {
        marginTop: 10,
    },
    list: {
        flex: 1,
    },
    notificationItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    notificationBody: {
        fontSize: 16,
        marginBottom: 8,
    },
    notificationDate: {
        fontSize: 12,
        color: '#666',
        alignSelf: 'flex-end',
    },
    emptyContainer: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        backgroundColor: '#ffebee',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
    }
}); 