import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItem = ({ icon, title, onPress, color }) => (
  <TouchableOpacity 
    style={[styles.menuItem, { backgroundColor: `${color}20` }]} 
    onPress={onPress}
  >
    <Feather name={icon} size={24} color={color} />
    <Text style={styles.menuItemText}>{title}</Text>
    <Feather name="chevron-right" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const Home = ({ navigation, mail }) => {
  const signOut = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('sessionToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { 
      icon: 'dollar-sign', 
      title: 'Mutual Funds', 
      screen: 'PersonalMF',
      color: '#3B82F6' 
    },
    { 
      icon: 'trending-up', 
      title: 'Stocks', 
      screen: 'PersonalizedStocks',
      color: '#10B981' 
    },
    { 
      icon: 'credit-card', 
      title: 'Fixed Deposits', 
      screen: 'FDRecommendations',
      color: '#8B5CF6' 
    },
    { 
      icon: 'calendar', 
      title: 'Expense Tracker', 
      screen: 'ExpenseTracker',
      color: '#EC4899' 
    },
    { 
      icon: 'pie-chart', 
      title: 'Portfolio', 
      screen: 'Portfolio',
      color: '#F59E0B' 
    },
    { 
      icon: 'message-square', 
      title: 'Financial Assistant', 
      screen: 'ChatBot',
      color: '#6366F1' 
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome,</Text>
        <Text style={styles.email}>{mail}</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Financial Services</Text>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              color={item.color}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginVertical: 24,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 8,
  }
});

export default Home;