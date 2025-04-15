import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import messaging from '@react-native-firebase/messaging';

// Firebase configuration - replace with your own config
const firebaseConfig = {
    apiKey: "AIzaSyBvn86q7jRmRcrbIHs89YvacM46VYyJJwk",
    authDomain: "lab8-cro.firebaseapp.com",
    projectId: "lab8-cro",
    storageBucket: "lab8-cro.firebasestorage.app",
    messagingSenderId: "806229201334",
    appId: "1:806229201334:android:388ada412644bb597cb117"
};

// Initialize Firebase app
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    console.log("Firebase initialization error:", error);
    // Firebase might already be initialized
    app = null;
}

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
    let token = null;

    if (Platform.OS === 'android') {
        try {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        } catch (error) {
            console.log("Error setting notification channel:", error);
        }
    }

    // Check if physical device
    if (Device.isDevice) {
        try {
            // Yêu cầu quyền
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
                // Lấy FCM token
                token = await messaging().getToken();
                console.log('FCM Token:', token);
            } else {
                console.log('Firebase messaging permission denied');
            }
        } catch (error) {
            console.log('Error getting FCM token:', error);

            // Fallback to Expo Notifications if Firebase fails
            try {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status === 'granted') {
                    const expoPushToken = await Notifications.getExpoPushTokenAsync();
                    token = expoPushToken.data;
                    console.log('Expo Push Token:', token);
                }
            } catch (expoError) {
                console.log('Error getting Expo Push Token:', expoError);
            }
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

// Set up notification listeners
export function setupNotificationListeners(notificationHandler) {
    // Xử lý thông báo Expo
    const expoListeners = setupExpoListeners(notificationHandler);

    // Xử lý thông báo Firebase
    const firebaseListeners = setupFirebaseListeners(notificationHandler);

    // Trả về hàm dọn dẹp
    return () => {
        expoListeners();
        firebaseListeners();
    };
}

// Thêm hàm thiết lập listener Firebase
function setupFirebaseListeners(notificationHandler) {
    let unsubscribes = [];

    try {
        // Xử lý thông báo khi ứng dụng đang chạy
        const foregroundSubscription = messaging().onMessage(async remoteMessage => {
            console.log('Foreground message received:', remoteMessage);

            // Hiển thị thông báo local
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: remoteMessage.notification?.title || 'New Message',
                    body: remoteMessage.notification?.body || 'You have a new message',
                    data: remoteMessage.data || {},
                },
                trigger: null,
            });

            // Gọi handler nếu có
            if (notificationHandler) {
                const notification = {
                    request: {
                        content: {
                            title: remoteMessage.notification?.title,
                            body: remoteMessage.notification?.body,
                            data: remoteMessage.data,
                        }
                    }
                };
                notificationHandler(notification);
            }
        });
        unsubscribes.push(foregroundSubscription);

        // Xử lý khi ứng dụng mở thông qua thông báo
        const backgroundSubscription = messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification opened app:', remoteMessage);
        });
        unsubscribes.push(backgroundSubscription);

        // Kiểm tra xem ứng dụng có được mở từ thông báo không
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('App opened from notification:', remoteMessage);
                }
            });

        // Thiết lập để nhận thông báo khi ứng dụng đóng
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background message:', remoteMessage);
        });
    } catch (error) {
        console.log('Error setting up Firebase listeners:', error);
    }

    return () => {
        unsubscribes.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
    };
}

// Tách các Expo listeners thành hàm riêng
function setupExpoListeners(notificationHandler) {
    let receivedSubscription = null;
    let responseSubscription = null;

    try {
        receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log('Expo notification received:', notification);
            if (notificationHandler) {
                notificationHandler(notification);
            }
        });

        responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Expo notification response:', response);
        });
    } catch (error) {
        console.log('Error setting up Expo notification listeners:', error);
    }

    return () => {
        if (receivedSubscription) {
            try {
                receivedSubscription.remove();
            } catch (error) {
                console.log('Error removing received subscription:', error);
            }
        }

        if (responseSubscription) {
            try {
                responseSubscription.remove();
            } catch (error) {
                console.log('Error removing response subscription:', error);
            }
        }
    };
}

// Send a test local notification
export async function sendTestNotification(title = "Test Notification", body = "This is a test notification from your app!") {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: { data: 'goes here' },
            },
            trigger: null, // show immediately
        });
        console.log("Test notification sent successfully");
        return true;
    } catch (error) {
        console.log("Error sending test notification:", error);
        throw error;
    }
} 