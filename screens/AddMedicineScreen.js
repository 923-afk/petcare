/**
 * AddMedicineScreen
 * 
 * Form to add a new medicine to the database
 * 
 * Form fields:
 * - name (required)
 * - dosage
 * - form
 * - species
 * - indication
 * - manufacturer
 * - barcode (pre-filled from route.params.barcode)
 * 
 * On save:
 * - Inserts into Supabase "medicines" table
 * - Navigates to MedicineDetailScreen with new data
 * 
 * @param {Object} route - Navigation route object
 * @param {Object} route.params - Route parameters
 * @param {string} route.params.barcode - Pre-filled barcode from scanner
 * @param {Object} navigation - Navigation object
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { supabase } from '../config/supabase';

export default function AddMedicineScreen({ route, navigation }) {
  // Get barcode from navigation params (pre-filled from scanner)
  const { barcode } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    form: '',
    species: '',
    indication: '',
    manufacturer: '',
    barcode: barcode || '',
  });

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Medicine name is required');
      return false;
    }

    if (!formData.barcode.trim()) {
      Alert.alert('Validation Error', 'Barcode is required');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check if Supabase client is available
    if (!supabase) {
      Alert.alert(
        'Configuration Error',
        'Supabase client not initialized. Please check your environment variables.'
      );
      return;
    }

    setLoading(true);

    try {
      // Prepare data for insertion
      const medicineData = {
        name: formData.name.trim(),
        dosage: formData.dosage.trim() || null,
        form: formData.form.trim() || null,
        species: formData.species.trim() || null,
        indication: formData.indication.trim() || null,
        manufacturer: formData.manufacturer.trim() || null,
        barcode: formData.barcode.trim(),
      };

      console.log('Inserting medicine:', medicineData);

      // Insert into Supabase
      const { data: insertedMedicine, error } = await supabase
        .from('medicines')
        .insert([medicineData])
        .select()
        .single();

      setLoading(false);

      if (error) {
        console.error('Error inserting medicine:', error);

        // Handle duplicate barcode error
        if (error.code === '23505') {
          Alert.alert(
            'Duplicate Barcode',
            'A medicine with this barcode already exists in the database.',
            [
              {
                text: 'View Existing',
                onPress: async () => {
                  // Fetch existing medicine and navigate to detail screen
                  const { data: existing } = await supabase
                    .from('medicines')
                    .select('*')
                    .eq('barcode', formData.barcode.trim())
                    .single();

                  if (existing) {
                    navigation.replace('MedicineDetail', { medicine: existing });
                  }
                },
              },
              {
                text: 'OK',
                style: 'cancel',
              },
            ]
          );
        } else {
          Alert.alert(
            'Error',
            `Failed to add medicine: ${error.message || 'Unknown error'}`
          );
        }
        return;
      }

      // Success - navigate to MedicineDetailScreen with new data
      if (insertedMedicine) {
        console.log('Medicine added successfully:', insertedMedicine);
        Alert.alert(
          'Success',
          'Medicine added successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to MedicineDetailScreen with the new medicine data
                navigation.replace('MedicineDetail', { medicine: insertedMedicine });
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setLoading(false);
      Alert.alert(
        'Error',
        `An unexpected error occurred: ${error.message || 'Unknown error'}`
      );
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Add New Medicine</Text>
          <Text style={styles.subtitle}>
            Fill in the medicine information below
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name - Required */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Medicine Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              placeholder="Enter medicine name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Barcode - Required, Pre-filled */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Barcode <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, !barcode && styles.inputEditable]}
              value={formData.barcode}
              onChangeText={(value) => updateField('barcode', value)}
              placeholder="EAN/UPC barcode"
              placeholderTextColor="#999"
              keyboardType="numeric"
              editable={!loading && !barcode} // Disable if pre-filled from scanner
            />
            {barcode && (
              <Text style={styles.hintText}>
                Barcode pre-filled from scanner
              </Text>
            )}
          </View>

          {/* Dosage */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              value={formData.dosage}
              onChangeText={(value) => updateField('dosage', value)}
              placeholder="e.g., 250mg, 500mg"
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Form</Text>
            <TextInput
              style={styles.input}
              value={formData.form}
              onChangeText={(value) => updateField('form', value)}
              placeholder="e.g., Tablet, Capsule, Liquid"
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Species */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Species</Text>
            <TextInput
              style={styles.input}
              value={formData.species}
              onChangeText={(value) => updateField('species', value)}
              placeholder="e.g., Dog, Cat, Bird"
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Indication */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Indication</Text>
            <TextInput
              style={styles.input}
              value={formData.indication}
              onChangeText={(value) => updateField('indication', value)}
              placeholder="e.g., Antibiotic, Analgesic"
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {/* Manufacturer */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer</Text>
            <TextInput
              style={styles.input}
              value={formData.manufacturer}
              onChangeText={(value) => updateField('manufacturer', value)}
              placeholder="Manufacturer name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Medicine</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  inputEditable: {
    backgroundColor: '#FFF',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
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
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
