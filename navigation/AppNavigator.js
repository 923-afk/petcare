/**
 * AppNavigator
 * 
 * Main navigation stack for the Vetcepi app
 * Includes the medicine scanning screens
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import medicine screens
import ScanMedicineScreen from '../screens/ScanMedicineScreen';
import MedicineDetailScreen from '../screens/MedicineDetailScreen';
import AddMedicineScreen from '../screens/AddMedicineScreen';

// Add your other existing screens here
// import HomeScreen from '../screens/HomeScreen';
// import LoginScreen from '../screens/LoginScreen';
// etc.

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ScanMedicine"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
        {/* Medicine Scanning Screens */}
        <Stack.Screen
          name="ScanMedicine"
          component={ScanMedicineScreen}
          options={{
            title: 'Scan Medicine',
            headerShown: true,
          }}
        />
        
        <Stack.Screen
          name="MedicineDetail"
          component={MedicineDetailScreen}
          options={{
            title: 'Medicine Details',
            headerShown: true,
          }}
        />
        
        <Stack.Screen
          name="AddMedicine"
          component={AddMedicineScreen}
          options={{
            title: 'Add New Medicine',
            headerShown: true,
          }}
        />

        {/* Add your other screens here */}
        {/* 
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
