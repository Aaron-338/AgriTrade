'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService, RegisterData } from '@/lib/services/authService';

// Define user types
type UserType = 'farmer' | 'buyer';

// Registration schema with Yup validation
const registrationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Please enter a valid phone number'
    ),
  termsAccepted: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
  userType: Yup.string()
    .oneOf(['farmer', 'buyer'], 'Please select a valid user type')
    .required('User type is required'),
  location: Yup.string()
    .when('userType', {
      is: 'farmer',
      then: () => Yup.string().required('Location is required for farmers'),
      otherwise: () => Yup.string(),
    }),
});

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // If already logged in, redirect to home
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'buyer' as 'farmer' | 'buyer',
      location: '',
      phone: '',
      termsAccepted: false,
    },
    validationSchema: registrationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    validate: (values) => {
      // Custom validation logic to debug the password validation
      const errors: any = {};
      
      // Manually validate password to help troubleshoot
      if (values.password) {
        const tests = [
          { condition: values.password.length >= 8, message: "Must be at least 8 characters" },
          { condition: /[A-Z]/.test(values.password), message: "Must contain uppercase letter" },
          { condition: /[a-z]/.test(values.password), message: "Must contain lowercase letter" },
          { condition: /[0-9]/.test(values.password), message: "Must contain a number" },
          { condition: /[^A-Za-z0-9]/.test(values.password), message: "Must contain a special character" }
        ];
        
        const failedTests = tests.filter(test => !test.condition);
        if (failedTests.length > 0) {
          errors.password = failedTests.map(t => t.message).join(", ");
        }
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        // Check if there are any validation errors manually
        const validateResult = await formik.validateForm();
        if (Object.keys(validateResult).length > 0) {
          setDebugInfo(`Validation errors: ${JSON.stringify(validateResult)}`);
          setLoading(false);
          return;
        }
        
        // Log validation status for debugging
        console.log('Form is submitting with values:', values);
        
        // Prepare registration data
        const registerData: RegisterData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          userType: values.userType,
          location: values.location,
          phone: values.phone,
        };
        
        // Call auth service to register user
        const newUser = await authService.register(registerData);
        console.log('User registered successfully:', newUser);
        
        // Auto-login after registration
        await authService.login({
          email: values.email,
          password: values.password
        });
        console.log('User logged in successfully, redirecting to success page');
        
        // Try direct navigation first
        window.location.href = '/register/success';
        
        // Fallback to router push
        // router.push('/register/success');
      } catch (err: any) {
        console.error('Registration error:', err);
        setError(err.message || 'Failed to register. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
  });

  // Helper function to determine if a field has an error
  const hasError = (fieldName: string) => {
    return formik.touched[fieldName as keyof typeof formik.touched] && 
           Boolean(formik.errors[fieldName as keyof typeof formik.errors]);
  };

  // Helper function to get error message for a field
  const getErrorMessage = (fieldName: string) => {
    return formik.touched[fieldName as keyof typeof formik.touched] ? 
           formik.errors[fieldName as keyof typeof formik.errors] : '';
  };

  // Function to determine password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.password);
  const passwordStrengthClass = [
    'bg-red-500',          // Very weak (0-1)
    'bg-orange-500',       // Weak (2)
    'bg-yellow-500',       // Medium (3)
    'bg-blue-500',         // Strong (4)
    'bg-green-500',        // Very strong (5)
  ][passwordStrength > 4 ? 4 : passwordStrength];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 py-6 px-8">
            <h2 className="text-2xl font-bold text-white">Create Your AgriTech Account</h2>
            <p className="text-green-100 mt-1">Join our community of farmers and buyers</p>
          </div>
          
          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="py-8 px-8">
            {/* General error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* User Type selection */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">I am a:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="farmer"
                    checked={formik.values.userType === 'farmer'}
                    onChange={formik.handleChange}
                    className="form-radio h-5 w-5 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">Farmer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={formik.values.userType === 'buyer'}
                    onChange={formik.handleChange}
                    className="form-radio h-5 w-5 text-green-600"
                  />
                  <span className="ml-2 text-gray-700">Buyer</span>
                </label>
              </div>
              {hasError('userType') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('userType')}</p>
              )}
            </div>
            
            {/* Name fields - 2 column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded ${
                    hasError('firstName') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {hasError('firstName') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('firstName')}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded ${
                    hasError('lastName') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {hasError('lastName') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('lastName')}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded ${
                  hasError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {hasError('email') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('email')}</p>
              )}
            </div>
            
            {/* Phone */}
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number (e.g., 123-456-7890)"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 border rounded ${
                  hasError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {hasError('phone') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('phone')}</p>
              )}
            </div>
            
            {/* Location (only for farmers) */}
            {formik.values.userType === 'farmer' && (
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                  Farm Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Farm Location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded ${
                    hasError('location') ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {hasError('location') && (
                  <p className="text-red-500 text-xs mt-1">{getErrorMessage('location')}</p>
                )}
              </div>
            )}
            
            {/* Password fields - 2 column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    hasError('password') ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                />
                {formik.values.password && (
                  <div className="mt-2">
                    <div className="h-2 relative max-w-xl rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gray-200 absolute"></div>
                      <div className={`h-full ${passwordStrengthClass} absolute`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                    </div>
                    <p className="text-xs mt-1">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Very weak"}
                      {passwordStrength === 2 && "Weak"}
                      {passwordStrength === 3 && "Medium"}
                      {passwordStrength === 4 && "Strong"}
                      {passwordStrength === 5 && "Very strong"}
                    </p>
                    {/* Password validation debug info */}
                    <div className="text-xs mt-1 text-gray-500">
                      <p>Has uppercase: {/[A-Z]/.test(formik.values.password) ? '✅' : '❌'}</p>
                      <p>Has lowercase: {/[a-z]/.test(formik.values.password) ? '✅' : '❌'}</p>
                      <p>Has number: {/[0-9]/.test(formik.values.password) ? '✅' : '❌'}</p>
                      <p>Has special char: {/[^A-Za-z0-9]/.test(formik.values.password) ? '✅' : '❌'}</p>
                      <p>Is 8+ chars: {formik.values.password.length >= 8 ? '✅' : '❌'}</p>
                    </div>
                  </div>
                )}
                {hasError('password') && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('password')}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    hasError('confirmPassword') ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500`}
                />
                {hasError('confirmPassword') && (
                  <p className="mt-1 text-sm text-red-500">{getErrorMessage('confirmPassword')}</p>
                )}
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formik.values.termsAccepted}
                  onChange={formik.handleChange}
                  className={`form-checkbox h-5 w-5 ${
                    hasError('termsAccepted') ? 'text-red-500' : 'text-green-600'
                  }`}
                />
                <span className="ml-2 text-gray-700">
                  I agree to the <Link href="/terms" className="text-green-600 hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {hasError('termsAccepted') && (
                <p className="text-red-500 text-xs mt-1">{getErrorMessage('termsAccepted')}</p>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex flex-col space-y-4 mb-4">
              {debugInfo && (
                <div className="text-xs text-red-600 p-2 bg-red-50 rounded">
                  {debugInfo}
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => {
                    // Manually trigger validation before form submission
                    formik.validateForm().then(errors => {
                      if (Object.keys(errors).length > 0) {
                        setDebugInfo(`Pre-submit validation: ${JSON.stringify(errors)}`);
                      } else {
                        setDebugInfo('Form is valid! Submitting...');
                      }
                    });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
                <Link href="/login" className="text-green-600 hover:underline">
                  Already have an account?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 