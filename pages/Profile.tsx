import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Modal } from '../components/ui/Modal';
import { DEFAULT_AVATAR } from '../constants';

// ── Account Settings Modal ──
const AccountSettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user, updateDisplayName } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!displayName.trim()) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await updateDisplayName(displayName.trim());
            setSuccess('Display name updated!');
            setTimeout(() => { setSuccess(''); onClose(); }, 1200);
        } catch (err: any) {
            setError(err.message || 'Failed to update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Account Settings">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="block w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-gray-500 text-sm cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                <Button onClick={handleSave} fullWidth disabled={loading || !displayName.trim()}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </Modal>
    );
};

// ── Security & Privacy Modal ──
const SecurityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user, changePassword, resetPassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleChangePassword = async () => {
        setError('');
        setSuccess('');

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => { setSuccess(''); onClose(); }, 1500);
        } catch (err: any) {
            const code = err?.code || '';
            if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Current password is incorrect');
            } else if (code === 'auth/weak-password') {
                setError('New password is too weak (min 6 characters)');
            } else {
                setError(err.message || 'Failed to change password');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendResetEmail = async () => {
        if (!user?.email) return;
        setLoading(true);
        setError('');
        try {
            await resetPassword(user.email);
            setSuccess('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Security & Privacy">
            <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-1">
                        <Icon name="Shield" size={18} className="text-blue-500" />
                        <span className="text-sm font-bold text-blue-700">Change Password</span>
                    </div>
                    <p className="text-xs text-blue-500">Update your account password</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                    <div className="relative">
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input
                        type={showPasswords ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="block w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={showPasswords} onChange={() => setShowPasswords(!showPasswords)} className="w-4 h-4 text-blue-500 rounded border-gray-300" />
                    <span className="text-xs text-gray-500 font-medium">Show passwords</span>
                </label>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                <Button onClick={handleChangePassword} fullWidth disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
                    {loading ? 'Changing...' : 'Change Password'}
                </Button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-300">Or</span></div>
                </div>

                <button
                    onClick={handleSendResetEmail}
                    disabled={loading}
                    className="w-full text-center text-sm text-blue-500 hover:text-blue-600 font-medium py-2 disabled:opacity-50"
                >
                    Send password reset email instead
                </button>
            </div>
        </Modal>
    );
};

// ── Profile Page ──
export const Profile: React.FC = () => {
    const { user, signOut } = useAuth();
    const [showAccountSettings, setShowAccountSettings] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);

    return (
        <div className="p-6 md:p-10 max-w-2xl mx-auto pb-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <img
                        src={user?.photoURL || DEFAULT_AVATAR}
                        alt="Profile"
                        className="w-24 h-24 rounded-full bg-gray-200 object-cover ring-4 ring-blue-50"
                    />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">{user?.displayName || 'User'}</h2>
                <p className="text-gray-500 mb-8 font-medium">{user?.email}</p>

                <div className="w-full space-y-3 mb-8">
                    <button onClick={() => setShowAccountSettings(true)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-gray-500 group-hover:text-blue-500 transition-colors">
                                <Icon name="Settings" size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-gray-700">Account Settings</span>
                                <span className="block text-xs text-gray-400">Edit display name</span>
                            </div>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-gray-400" />
                    </button>

                    <button onClick={() => setShowSecurity(true)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-gray-500 group-hover:text-blue-500 transition-colors">
                                <Icon name="Shield" size={20} />
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-gray-700">Security & Privacy</span>
                                <span className="block text-xs text-gray-400">Change password</span>
                            </div>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="w-full">
                    <Button variant="danger" fullWidth onClick={signOut} className="!bg-red-50 !text-red-500 hover:!bg-red-100 hover:shadow-none">
                        <div className="flex items-center gap-2">
                            <Icon name="LogOut" size={18} />
                            <span>Sign Out</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="text-center mt-8 text-xs text-gray-400 font-medium">
                MaVault v1.0.0
            </div>

            {/* Modals */}
            <AccountSettingsModal isOpen={showAccountSettings} onClose={() => setShowAccountSettings(false)} />
            <SecurityModal isOpen={showSecurity} onClose={() => setShowSecurity(false)} />
        </div>
    );
};