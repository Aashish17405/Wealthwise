import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { MotiView, MotiText } from 'moti';
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut 
} from "firebase/auth";

const Login = ({ navigation, user1, email }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Form validation helpers
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar };
  };

  const clear = () => {
    setErrors({});
    setName('');
    setEmailInput('');
    setPassword('');
    setPhone('');
    setShowPassword(false);
    setConfirmPassword('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!emailInput) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(emailInput)) {
      newErrors.email = 'Please enter a valid email';
    }
  
    if (!phone && !isLogin) {
      newErrors.phone = 'Mobile number is required';
    } else if (phone && !/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
  
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.hasMinLength) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!(passwordValidation.hasUpperCase && passwordValidation.hasLowerCase && passwordValidation.hasNumber && passwordValidation.hasSpecialChar)) {
        newErrors.password = 'Password must include uppercase, lowercase, a number, and a special character';
      }
    }
  
    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  
    if (!name && !isLogin) {
      newErrors.name = 'Name is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailInput, password);
      const user = userCredential.user;
      
      if (user && !user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before signing in');
        setLoading(false);
        return;
      }
      
      // Store user session
      const authToken = await user.getIdToken();
      await AsyncStorage.setItem('userEmail', emailInput);
      await AsyncStorage.setItem('sessionToken', authToken);
      
      // Update app state
      user1(true);
      email(emailInput);
      clear();
      setLoading(false);
      
      // Navigate to home
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      let errorMessage = 'An error occurred during sign in';
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User not found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Invalid password';
          break;
        default:
          console.error('Login error:', error);
      }
      
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const signUp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Clear form
      setLoading(false);
      setIsLogin(true);
      clear();
      
      Alert.alert(
        'Registration Successful',
        'A verification email has been sent to your email address. Please verify your email to continue.'
      );
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          console.error('Registration error:', error);
      }
      
      Alert.alert('Registration Failed', errorMessage);
    }
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      if (isLogin) {
        handleLogin();
      } else {
        signUp();
      }
    }
  };

  const renderErrorMessage = (error) => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-circle" size={16} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 500 }}
              style={styles.formContainer}
            >
              <MotiText
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={styles.title}
              >
                {isLogin ? 'WealthWise' : 'Create Account'}
              </MotiText>
              
              <Text style={styles.subtitle}>
                {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
              </Text>

              <View style={styles.formFields}>
                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                      <Feather name="user" size={20} color="#9ca3af" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={setName}
                      />
                    </View>
                    {renderErrorMessage(errors.name)}
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                    <Feather name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={emailInput}
                      onChangeText={setEmailInput}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {renderErrorMessage(errors.email)}
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, errors.phone ? styles.inputError : null]}>
                      <Feather name="phone" size={20} color="#9ca3af" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {renderErrorMessage(errors.phone)}
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                    <Feather name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                  </View>
                  {renderErrorMessage(errors.password)}
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                      <Feather name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                      />
                    </View>
                    {renderErrorMessage(errors.confirmPassword)}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchModeButton}
                  onPress={() => {
                    setIsLogin(!isLogin);
                    clear();
                  }}
                >
                  <Text style={styles.switchModeText}>
                    {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  formFields: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#1f2937',
  },
  eyeIcon: {
    padding: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  errorText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
  },
  submitButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchModeText: {
    color: '#7c3aed',
    fontSize: 14,
  },
});

export default Login;
