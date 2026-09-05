'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import {
  useLoginCustomerMutation,
  useRegisterCustomerMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGoogleAuthMutation,
} from '@/store/services/apiService';
import {
  X,
  Phone,
  Mail,
  Lock,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  // RTK Query Mutations
  const [loginCustomer, { isLoading: isLoginLoading }] = useLoginCustomerMutation();
  const [registerCustomer, { isLoading: isRegisterLoading }] = useRegisterCustomerMutation();
  const [sendOtpApi, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtpApi, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [googleAuthApi, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  // Mode: 'email-login' | 'register'
  const [authMethod, setAuthMethod] = useState<'email-login' | 'register'>(
    initialMode === 'register' ? 'register' : 'email-login'
  );

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);

  // Email States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register States
  const [name, setName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Google Modal input / simulation fallback if needed
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      setErrorMsg('Please enter a valid 11-digit mobile number');
      return;
    }
    setErrorMsg('');

    try {
      const res = await sendOtpApi({ phone }).unwrap();
      if (res.success) {
        setOtpSent(true);
        if (res.otp) {
          setOtpCode(res.otp.split(''));
        }
      } else {
        setErrorMsg(res.message || 'Failed to send OTP code');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to send OTP. Please check backend connection.');
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpCode.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter 4-digit OTP code');
      return;
    }
    setErrorMsg('');

    try {
      const res = await verifyOtpApi({ phone, otp: enteredOtp }).unwrap();
      if (res.success && res.token && res.user) {
        dispatch(
          setCredentials({
            token: res.token,
            user: res.user,
          })
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'OTP verification failed');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'OTP verification failed. Invalid OTP code.');
    }
  };

  // Handle Email / Phone Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    setErrorMsg('');

    try {
      const res = await loginCustomer({ login: loginIdentifier, password }).unwrap();
      if (res.success && res.token && res.user) {
        dispatch(
          setCredentials({
            token: res.token,
            user: res.user,
          })
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Invalid credentials. Please check login and password.');
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regPhone || !regPassword) {
      setErrorMsg('Please fill in all required fields');
      return;
    }
    setErrorMsg('');

    try {
      const res = await registerCustomer({
        name,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword,
      }).unwrap();

      if (res.success && res.token && res.user) {
        dispatch(
          setCredentials({
            token: res.token,
            user: res.user,
          })
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Registration failed. Phone or email may already be in use.');
    }
  };

  // Handle Google Auth ("Continue with Google") via Socialite OAuth Redirect
  const handleGoogleSignIn = () => {
    setErrorMsg('');
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${apiBase}/auth/google/redirect`;
  };

  const isLoading = isLoginLoading || isRegisterLoading || isSendingOtp || isVerifyingOtp || isGoogleLoading;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Welcome to ShymMarket</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {authMethod === 'register' ? 'Create Customer Account' : 'Sign in to Account'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Access 20-min express orders, vouchers & live tracking
          </p>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/60 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setAuthMethod('email-login');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 border-b-2 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'email-login'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-3 border-b-2 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              authMethod === 'register'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Modal Body Forms */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}



          {/* MODE 2: EMAIL / PHONE LOGIN */}
          {authMethod === 'email-login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="customer@gmail.com or 01712345678"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">Password</label>
                  <a href="#" className="text-[11px] font-bold text-emerald-600 hover:underline">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 3: NEW CUSTOMER REGISTRATION */}
          {authMethod === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Saimon Hosen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="saimon@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          {/* GOOGLE SIGN-IN BUTTON ("Continue with Google") */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Footer Security Notice */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>256-bit Encrypted Secure Login</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
