import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') setError('No account found with this email');
      else if (code === 'auth/wrong-password') setError('Incorrect password');
      else if (code === 'auth/email-already-in-use') setError('Email already registered');
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters');
      else if (code === 'auth/invalid-email') setError('Invalid email address');
      else setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setError('');
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 text-blue-500">
            <Icon name="Lock" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? 'Sign in to your vault' : 'Start organizing your digital life'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
                <Icon name={showPassword ? 'Eye' : 'EyeOff'} size={20} />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {resetSent && <p className="text-green-500 text-sm text-center">Password reset email sent! Check your inbox.</p>}

          <Button type="submit" fullWidth className="mt-4 !py-4 text-lg" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <button onClick={handleForgotPassword} className="text-gray-500 hover:text-gray-700 font-medium" type="button">Forgot Password?</button>
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); setResetSent(false); }}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {isLogin ? 'Create Account' : 'Login instead'}
          </button>
        </div>

        <div className="my-8 relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-300">Or</span></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <Icon name="Chrome" size={20} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Continue with Google</span>
        </button>

        <p className="mt-8 text-center text-[10px] text-gray-300">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
