# Firebase Push Notifications Setup for Expo React Native

This guide will help you set up Firebase Cloud Messaging (FCM) for your Expo React Native application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click "Add project" and follow the setup steps.
3. Give your project a name and accept the terms.
4. Optionally enable Google Analytics.
5. Click "Create project".

## 2. Add an Android App to Your Firebase Project

1. In your Firebase project, click the Android icon (</>) to add an Android app.
2. Enter your app's package name (found in app.json as `android.package`).
3. Enter a nickname for your app.
4. Download the `google-services.json` file.
5. Place the file in your project's `android/app` directory.

## 3. Add an iOS App to Your Firebase Project (if applicable)

1. In your Firebase project, click the iOS icon (</>) to add an iOS app.
2. Enter your app's bundle ID (found in app.json as `ios.bundleIdentifier`).
3. Enter a nickname for your app.
4. Download the `GoogleService-Info.plist` file.
5. Place the file in your project's `ios` directory.

## 4. Update Your app.json File

Add the following configuration to your app.json:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./android/app/google-services.json",
      "package": "your.package.name"
    },
    "ios": {
      "googleServicesFile": "./ios/GoogleService-Info.plist",
      "bundleIdentifier": "your.bundle.identifier"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ],
      "@react-native-firebase/app"
    ]
  }
}
```

## 5. Update Your Firebase Config

In the file `app/utils/notificationHelper.js`, update the `firebaseConfig` object with your project's configuration:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

You can find these values in your Firebase project settings.

## 6. Additional Setup for Expo Development Build

When using Expo, you need to create a development build to use Firebase Cloud Messaging:

```bash
npx expo prebuild
npx expo run:android  # or npx expo run:ios
```

## 7. Testing Push Notifications

You can test push notifications using:

1. The test button in the app
2. Firebase Console (Cloud Messaging section)
3. Using the Firebase Admin SDK to send messages programmatically

## 8. Troubleshooting

- Make sure you're testing on a physical device, not an emulator/simulator
- Check that you have proper internet connectivity
- Verify your Firebase configuration is correct
- Check that you have requested and been granted notification permissions
- Look for any error messages in the console logs

## 9. Additional Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Expo Firebase Setup Guide](https://docs.expo.dev/guides/using-firebase/) 