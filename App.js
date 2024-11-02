import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import firebase from '@react-native-firebase/app';

// Initialize Firebase
const firebaseConfig = {
  // Your web app's Firebase configuration
  // You can find this in your Firebase console
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  return (
    <SafeAreaView>
      <StatusBar />
      {/* Your app components */}
    </SafeAreaView>
  );
}

export default App;