import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from './ui/Icon';
import { useAuth } from '../context/AuthContext';
import { hasPin, setPin, verifyPin, removePin } from '../services/pin';

type PinMode = 'loading' | 'create' | 'confirm' | 'enter' | 'forgot-verify' | 'forgot-reset';

interface PinPadProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PinPad: React.FC<PinPadProps> = ({ onSuccess, onCancel }) => {
  const { user, changePassword } = useAuth();
  const [pin, setPin_] = useState('');
  const [newPin, setNewPin] = useState('');
  const [mode, setMode] = useState<PinMode>('loading');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // Check if user has PIN on mount
  useEffect(() => {
    if (!user) return;
    hasPin(user.uid).then(exists => {
      setMode(exists ? 'enter' : 'create');
    }).catch(() => setMode('create'));
  }, [user]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Handle PIN completion (4 digits entered)
  useEffect(() => {
    if (pin.length !== 4 || !user) return;

    const handle = async () => {
      if (mode === 'create') {
        // Store the first entry and ask to confirm
        setNewPin(pin);
        setPin_('');
        setMode('confirm');
        setError('');
      } else if (mode === 'confirm') {
        if (pin === newPin) {
          // PINs match — save to Firestore
          await setPin(user.uid, pin);
          setTimeout(onSuccess, 300);
        } else {
          triggerShake();
          setError('PINs do not match. Try again.');
          setPin_('');
          setNewPin('');
          setMode('create');
        }
      } else if (mode === 'enter') {
        const valid = await verifyPin(user.uid, pin);
        if (valid) {
          setTimeout(onSuccess, 300);
        } else {
          triggerShake();
          setError('Incorrect PIN');
          setPin_('');
        }
      } else if (mode === 'forgot-reset') {
        // Creating new PIN after forgot flow
        setNewPin(pin);
        setPin_('');
        setMode('confirm');
        setError('');
      }
    };

    handle().catch(err => {
      setError(err.message || 'Something went wrong');
      setPin_('');
    });
  }, [pin, mode, user, newPin, onSuccess]);

  const handleNum = useCallback((num: string) => {
    setPin_(prev => prev.length < 4 ? prev + num : prev);
    setError('');
  }, []);

  const handleBackspace = useCallback(() => {
    setPin_(prev => prev.slice(0, -1));
  }, []);

  const handleForgotPin = () => {
    setMode('forgot-verify');
    setPin_('');
    setError('');
    setForgotPassword('');
  };

  const handleVerifyPassword = async () => {
    if (!forgotPassword || !user?.email) return;
    setForgotLoading(true);
    setError('');
    try {
      // Try to re-authenticate with entered password to verify identity
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const { auth: firebaseAuth } = await import('../services/firebase');
      await signInWithEmailAndPassword(firebaseAuth, user.email, forgotPassword);

      // Password verified — remove old PIN and let user create new one
      await removePin(user.uid);
      setMode('forgot-reset');
      setForgotPassword('');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Incorrect password');
      } else {
        setError(err.message || 'Verification failed');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  // Loading state
  if (mode === 'loading') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Forgot PIN — password verification screen
  if (mode === 'forgot-verify') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col items-center">
          <button onClick={() => { setMode('enter'); setError(''); }} className="absolute top-6 left-6 text-gray-400 font-medium text-sm flex items-center gap-1">
            <Icon name="ChevronLeft" size={16} /> Back
          </button>

          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
              <Icon name="KeyRound" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset PIN</h2>
            <p className="text-gray-400 text-sm text-center">Enter your account password to verify your identity</p>
          </div>

          <div className="w-full space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account Password</label>
              <input
                type="password"
                value={forgotPassword}
                onChange={(e) => setForgotPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                autoFocus
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleVerifyPassword}
              disabled={forgotLoading || !forgotPassword}
              className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {forgotLoading ? 'Verifying...' : 'Verify & Reset PIN'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Title and subtitle based on mode ---
  let title = 'Private Space';
  let subtitle = 'Enter PIN to unlock';
  if (mode === 'create') {
    title = 'Create PIN';
    subtitle = 'Set a 4-digit PIN for your vault';
  } else if (mode === 'confirm') {
    title = 'Confirm PIN';
    subtitle = 'Re-enter your PIN to confirm';
  } else if (mode === 'forgot-reset') {
    title = 'New PIN';
    subtitle = 'Create a new 4-digit PIN';
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom duration-300">
      <div className="w-full max-w-sm flex flex-col items-center">
        <button onClick={onCancel} className="absolute top-6 left-6 text-gray-400 font-medium text-sm">Cancel</button>

        <div className="mb-10 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${mode === 'create' || mode === 'confirm' || mode === 'forgot-reset' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
            <Icon name={mode === 'create' || mode === 'confirm' || mode === 'forgot-reset' ? 'ShieldPlus' : 'Lock'} size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {/* Dots */}
        <div className={`flex gap-4 mb-16 ${shake ? 'animate-pulse' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${i < pin.length
                ? (mode === 'create' || mode === 'confirm' || mode === 'forgot-reset' ? 'bg-green-500 scale-110' : 'bg-blue-500 scale-110')
                : 'bg-gray-200'
              }`}></div>
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-x-12 gap-y-8 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNum(num.toString())}
              className="text-2xl font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center transition-colors"
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {mode === 'enter' ? (
              <button onClick={handleForgotPin} className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Forgot?</button>
            ) : (
              <Icon name="Ghost" size={24} className="text-blue-200" />
            )}
          </div>
          <button
            onClick={() => handleNum('0')}
            className="text-2xl font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 w-16 h-16 rounded-full transition-colors"
          >
            <Icon name="Delete" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
