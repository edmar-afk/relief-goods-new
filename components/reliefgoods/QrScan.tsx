/* eslint-disable react-hooks/rules-of-hooks */
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Button,
} from "react-native";

export default function QrScan() {
  const [scannedData, setScannedData] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="mb-4">We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        className="absolute w-72 h-72"
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => {
          setScannedData(data);
        }}
      />

      {scannedData && (
        <View className="mt-80 px-4 py-3 bg-gray-100 rounded-lg">
          <Text className="text-base font-semibold">
            Scanned: {scannedData}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
