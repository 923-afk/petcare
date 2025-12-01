/**
 * ScanMedicineScreen
 * 
 * Full-featured barcode scanner for medicine lookup
 * - Requests camera permission
 * - Shows live camera preview
 * - Detects EAN/UPC barcodes
 * - Cooldown mechanism to prevent duplicate scans
 * - Queries Supabase for medicine by barcode
 * - Navigates to MedicineDetailScreen if found, or AddMedicineScreen if not found
 * 
 * @requires expo-barcode-scanner
 * @requires @supabase/supabase-js
 * @requires react-navigation
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { supabase } from '../config/supabase';

// Cooldown duration in milliseconds (prevents duplicate scans)
const SCAN_COOLDOWN_MS = 2000; // 2 seconds

export default function ScanMedicineScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref to track last scan time for cooldown
  const lastScanTime = useRef(0);
  // Ref to track last scanned barcode to prevent immediate re-scan
  const lastScannedBarcode = useRef(null);

  // Request camera permission on mount
  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Reset scanner when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetScanner();
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * Request camera permission
   */
  const requestCameraPermission = async () => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        setError('Camera permission is required to scan barcodes');
      }
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      setError('Failed to request camera permission');
      setHasPermission(false);
    }
  };

  /**
   * Check if enough time has passed since last scan (cooldown)
   */
  const canScan = () => {
    const now = Date.now();
    const timeSinceLastScan = now - lastScanTime.current;
    return timeSinceLastScan >= SCAN_COOLDOWN_MS;
  };

  /**
   * Handle barcode scan event
   */
  const handleBarCodeScanned = async ({ type, data }) => {
    // Prevent multiple simultaneous scans
    if (scanned || loading) {
      return;
    }

    // Cooldown check - prevent scanning too quickly
    if (!canScan()) {
      console.log('Scan cooldown active, ignoring scan');
      return;
    }

    // Prevent scanning the same barcode immediately
    if (lastScannedBarcode.current === data) {
      console.log('Same barcode scanned, ignoring duplicate');
      return;
    }

    // Update last scan time and barcode
    lastScanTime.current = Date.now();
    lastScannedBarcode.current = data;
    setScanned(true);
    setLoading(true);
    setError(null);

    try {
      console.log('Scanned barcode:', data, 'Type:', type);

      // Validate barcode format (basic check)
      if (!data || data.trim().length === 0) {
        throw new Error('Invalid barcode format');
      }

      // Check if Supabase client is available
      if (!supabase) {
        throw new Error('Supabase client not initialized. Check your environment variables.');
      }

      // Query Supabase for medicine with this barcode
      const { data: medicine, error: queryError } = await supabase
        .from('medicines')
        .select('*')
        .eq('barcode', data.trim())
        .single();

      setLoading(false);

      if (queryError) {
        // Handle different error cases
        if (queryError.code === 'PGRST116') {
          // PGRST116 = no rows returned (medicine not found)
          console.log('Medicine not found, navigating to AddMedicineScreen');
          navigation.navigate('AddMedicine', { barcode: data.trim() });
        } else if (queryError.code === 'PGRST301') {
          // PGRST301 = multiple rows returned (shouldn't happen with .single() but handle it)
          console.warn('Multiple medicines found with same barcode');
          Alert.alert(
            'Database Error',
            'Multiple medicines found with this barcode. Please contact support.',
            [
              {
                text: 'OK',
                onPress: () => resetScanner(),
              },
            ]
          );
        } else {
          // Other database errors
          console.error('Error querying medicine:', queryError);
          setError(queryError.message || 'Failed to query medicine database');
          Alert.alert(
            'Database Error',
            'Failed to query medicine database. Please try again.',
            [
              {
                text: 'OK',
                onPress: () => resetScanner(),
              },
            ]
          );
        }
      } else if (medicine) {
        // Medicine found successfully
        console.log('Medicine found:', medicine);
        navigation.navigate('MedicineDetail', { medicine });
      } else {
        // Unexpected case - no error but no medicine either
        console.warn('No medicine data returned');
        navigation.navigate('AddMedicine', { barcode: data.trim() });
      }
    } catch (err) {
      console.error('Unexpected error in handleBarCodeScanned:', err);
      setLoading(false);
      setError(err.message || 'An unexpected error occurred');
      
      Alert.alert(
        'Error',
        err.message || 'An unexpected error occurred. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => resetScanner(),
          },
        ]
      );
    }
  };

  /**
   * Reset scanner to allow new scans
   */
  const resetScanner = () => {
    setScanned(false);
    setLoading(false);
    setError(null);
    // Clear last scanned barcode after a delay to allow re-scanning same barcode
    setTimeout(() => {
      lastScannedBarcode.current = null;
    }, SCAN_COOLDOWN_MS);
  };

  /**
   * Render permission request screen
   */
  const renderPermissionRequest = () => (
    <View style={styles.container}>
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionMessage}>
          Vetcepi needs access to your camera to scan medicine barcodes.
        </Text>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render loading/permission checking screen
   */
  const renderLoading = () => (
    <View style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    </View>
  );

  /**
   * Render scanner overlay
   */
  const renderOverlay = () => (
    <View style={styles.overlay}>
      {/* Top overlay */}
      <View style={styles.topOverlay} />
      
      {/* Middle overlay with scan area */}
      <View style={styles.middleOverlay}>
        <View style={styles.sideOverlay} />
        <View style={styles.scanArea}>
          {/* Corner indicators */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Scanning line animation */}
          {!scanned && !loading && (
            <View style={styles.scanLine} />
          )}
        </View>
        <View style={styles.sideOverlay} />
      </View>
      
      {/* Bottom overlay with controls */}
      <View style={styles.bottomOverlay}>
        <Text style={styles.instructionText}>
          {scanned 
            ? 'Processing...' 
            : 'Position the barcode within the frame'}
        </Text>
        
        {loading && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.statusText}>Looking up medicine...</Text>
          </View>
        )}
        
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {scanned && !loading && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={resetScanner}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Show loading state while checking permission
  if (hasPermission === null) {
    return renderLoading();
  }

  // Show permission request if denied
  if (hasPermission === false) {
    return renderPermissionRequest();
  }

  // Render scanner with camera preview
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[
          BarCodeScanner.Constants.BarCodeType.ean13,
          BarCodeScanner.Constants.BarCodeType.ean8,
          BarCodeScanner.Constants.BarCodeType.upc_a,
          BarCodeScanner.Constants.BarCodeType.upc_e,
          BarCodeScanner.Constants.BarCodeType.code128,
          BarCodeScanner.Constants.BarCodeType.code39,
        ]}
        // Additional scanner options
        ratio="16:9"
      />
      {renderOverlay()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleOverlay: {
    flexDirection: 'row',
    height: 280,
    alignItems: 'center',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    width: '90%',
    height: 2,
    backgroundColor: '#007AFF',
    position: 'absolute',
    opacity: 0.8,
    // Simple animation - you can enhance this with Animated API if needed
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  statusText: {
    color: '#FFF',
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    maxWidth: '90%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 140,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#1C1C1E',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
