import { Camera, CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

export default function Scanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      } else {
        Alert.alert('Location permission is required');
      }
    };

    getLocation();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false; // Reset lock when app returns to foreground
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (data && !qrLock.current) {
      qrLock.current = true; // Lock scanning immediately
      try {
        // Decode the JSON data from QR code
        const { latitude, longitude, name } = JSON.parse(data);

        if (userLocation) {
          const distance = getDistance(
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude, longitude }
          );

          if (distance <= 100) {
            Alert.alert(`Welcome to ${name}`, "You are at the correct location.", [
              { 
                text: "OK", 
                onPress: () => router.push({ pathname: '/welcome', params: { name } })
              }
            ]);
          } else {
            Alert.alert("Location Mismatch", "You are not within 100 meters of the QR code location.");
          }
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while processing the QR code.");
      } finally {
        // Optionally unlock after an intentional delay or navigation
        setTimeout(() => {
          qrLock.current = false; // Reset lock to allow scanning again if necessary
        }, 5000); // Adjust the delay as needed
      }
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scanner",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
      />
      <Overlay />
    </SafeAreaView>
  );
}
