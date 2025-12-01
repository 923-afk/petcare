/**
 * MedicineDetailScreen
 * 
 * Displays medicine information:
 * - Name
 * - Dosage
 * - Form
 * - Species
 * - Indication
 * - Manufacturer
 * 
 * Features:
 * - Edit button (placeholder, not functional yet)
 * - Back button
 * 
 * @param {Object} route - Navigation route object
 * @param {Object} route.params - Route parameters
 * @param {Object} route.params.medicine - Medicine data object
 * @param {Object} navigation - Navigation object
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function MedicineDetailScreen({ route, navigation }) {
  // Get medicine data from navigation params
  const { medicine } = route.params || {};

  // Handle case where medicine data is missing
  if (!medicine) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No medicine data available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Handle Edit button press (placeholder)
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit button pressed - functionality not implemented yet');
    // Future: navigation.navigate('EditMedicine', { medicine });
  };

  // Handle Back button press
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {medicine.name || 'Unknown Medicine'}
          </Text>
        </View>

        {/* Medicine Information Section */}
        <View style={styles.infoSection}>
          {/* Dosage */}
          {medicine.dosage && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dosage:</Text>
              <Text style={styles.value}>{medicine.dosage}</Text>
            </View>
          )}

          {/* Form */}
          {medicine.form && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Form:</Text>
              <Text style={styles.value}>{medicine.form}</Text>
            </View>
          )}

          {/* Species */}
          {medicine.species && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Species:</Text>
              <Text style={styles.value}>{medicine.species}</Text>
            </View>
          )}

          {/* Indication */}
          {medicine.indication && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Indication:</Text>
              <Text style={styles.value}>{medicine.indication}</Text>
            </View>
          )}

          {/* Manufacturer */}
          {medicine.manufacturer && (
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.label}>Manufacturer:</Text>
              <Text style={styles.value}>{medicine.manufacturer}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 120,
    flexShrink: 0,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
});
