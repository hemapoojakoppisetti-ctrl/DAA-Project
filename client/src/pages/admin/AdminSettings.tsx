import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../utils/api';
import toast from 'react-hot-toast';
import { User, Lock, Shield, Save } from 'lucide-react';

/* ================= TYPES ================= */

interface Admin {
  name?: string;
  email?: string;
  role?: string;
}

interface ProfileForm {
  name: string;
  email: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/* ================= COMPONENT ================= */

export default function AdminSettings() {

  const { admin, setAdmin } = useAuth();

  const [profile, setProfile] = useState<ProfileForm>({
    name: admin?.name || '',
    email: admin?.email || ''
  });

  const [passForm, setPassForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [savingPass, setSavingPass] = useState<boolean>(false);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await updateProfile(profile);

      setAdmin(res.data);
      localStorage.setItem('daa_admin', JSON.stringify(res.data));

      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassSave = async (e: FormEvent) => {
    e.preventDefault();

    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSavingPass(true);

    try {
      await changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });

      toast.success('Password changed!');

      setPassForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Error');
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="fade-in max-w-2xl">

      <div className="mb-6">
        <h1 className="text-xl font-bold font-display text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <div className="card mb-6">

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-display">
              Profile Information
            </h3>
            <p className="text-xs text-gray-500">
              Update your name and email
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">

          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={profile.name}
              onChange={(e) =>
                setProfile(p => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              value={profile.email}
              onChange={(e) =>
                setProfile(p => ({ ...p, email: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label">Role</label>
            <input
              className="input bg-gray-50"
              value={admin?.role || ''}
              disabled
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>

        </form>
      </div>

      {/* Password */}
      <div className="card mb-6">

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 font-display">
              Change Password
            </h3>
            <p className="text-xs text-gray-500">
              Keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handlePassSave} className="space-y-4">

          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              className="input"
              value={passForm.currentPassword}
              onChange={(e) =>
                setPassForm(p => ({ ...p, currentPassword: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              className="input"
              value={passForm.newPassword}
              onChange={(e) =>
                setPassForm(p => ({ ...p, newPassword: e.target.value }))
              }
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className="input"
              value={passForm.confirmPassword}
              onChange={(e) =>
                setPassForm(p => ({ ...p, confirmPassword: e.target.value }))
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingPass}
            className="btn-primary"
          >
            <Lock className="w-4 h-4" />
            {savingPass ? 'Changing...' : 'Change Password'}
          </button>

        </form>
      </div>

      {/* Info */}
      <div className="card bg-primary-50 border-primary-100">

        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-primary-900 font-display">
            System Information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Platform', 'DAA - Dynamic Academic Audits'],
            ['Version', 'v1.0.0'],
            ['University', 'JNTUK'],
            ['Environment', 'Production']
          ].map(([k, v]) => (
            <div key={k}>
              <span className="text-primary-600 font-semibold">{k}:</span>{' '}
              <span className="text-primary-800">{v}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}