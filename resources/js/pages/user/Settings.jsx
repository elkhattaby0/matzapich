import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import AvatarUploader from '../../components/AvatarUploader';

export default function Settings({ onClose }) {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);

  if (!user) {
    return <div className="settings-loading">Loading settings...</div>;
  }

  const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

  const cacheBuster = user.updated_at || user.avatar || Date.now();

  const currentAvatarUrl = user.avatar
    ? `${APP_URL}/storage/${user.avatar}?t=${encodeURIComponent(cacheBuster)}`
    : `${APP_URL}/storage/avatars/noavatar.png`;

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleAvatarChange = (compressedImage) => {
    setPendingAvatar(compressedImage || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    for (const [key, value] of formData.entries()) {
      if (value === '' || value === null) {
        formData.delete(key);
      }
    }

    if (pendingAvatar) {
      formData.append('avatar', pendingAvatar);
    }

    formData.append('_method', 'PUT');

    try {
      setUploading(true);

      const response = await axios.post('/api/user', formData, {
        headers: { Accept: 'application/json' },
      });

      setUser(response.data.user);
      setPendingAvatar(null);

      if (onClose) onClose();
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Update failed:', error.response?.data || error);

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0];
        alert(`Validation error: ${firstError}`);
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to update settings');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="settingsPage">
      <form onSubmit={handleSubmit} className="settingsForm">
        {/* Profile picture */}
        <section className="settingsSection settingsSection--profile">
          <h3 className="settingsSectionTitle">Profile Picture</h3>
          <AvatarUploader
            onImageCompressed={handleAvatarChange}
            currentAvatar={currentAvatarUrl}
          />
          {uploading && <p className="settingsSaving">Saving...</p>}
        </section>

        {/* Basic information */}
        <section className="settingsSection settingsSection--basic">
          <h3 className="settingsSectionTitle">Basic Information</h3>

          <div className="settingsGrid settingsGrid--twoCols">
            <div className="settingsField">
              <label className="settingsLabel">First Name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={user.firstName}
                className="settingsInput"
              />
            </div>
            <div className="settingsField">
              <label className="settingsLabel">Last Name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={user.lastName}
                className="settingsInput"
              />
            </div>
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              defaultValue={formatDateForInput(user.dateOfBirth)}
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              disabled
              className="settingsInput settingsInput--disabled"
            />
          </div>
        </section>

        {/* Change password */}
        <section className="settingsSection settingsSection--password">
          <h3 className="settingsSectionTitle">Change Password</h3>

          <div className="settingsField">
            <label className="settingsLabel">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="settingsInput"
            />
          </div>
        </section>

        {/* About you */}
        <section className="settingsSection settingsSection--about">
          <h3 className="settingsSectionTitle">About You</h3>

          <div className="settingsField">
            <label className="settingsLabel">Bio</label>
            <textarea
              name="bio"
              rows="4"
              placeholder="Tell us about yourself..."
              defaultValue={user.bio}
              className="settingsTextarea"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Relationship Status</label>
            <select
              name="socialStatus"
              defaultValue={user.socialStatus}
              className="settingsSelect"
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="in_relationship">In a relationship</option>
              <option value="engaged">Engaged</option>
              <option value="married">Married</option>
              <option value="complicated">It's complicated</option>
            </select>
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Gender</label>
            <select
              name="gender"
              defaultValue={user.gender}
              className="settingsSelect"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="settingsField">
            <label className="settingsLabel">From</label>
            <input
              type="text"
              name="from"
              placeholder="e.g., Agadir, Morocco"
              defaultValue={user.from}
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Lives in</label>
            <input
              type="text"
              name="livesIn"
              placeholder="e.g., Agadir, Morocco"
              defaultValue={user.livesIn}
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Work</label>
            <input
              type="text"
              name="work"
              placeholder="e.g., Software Engineer at Matzapish"
              defaultValue={user.work}
              className="settingsInput"
            />
          </div>

          <div className="settingsField">
            <label className="settingsLabel">Studied at</label>
            <input
              type="text"
              name="studied"
              placeholder="e.g., OFPPT"
              defaultValue={user.studied}
              className="settingsInput"
            />
          </div>
        </section>

        {/* Actions */}
        <div className="settingsActions">
          <button
            type="button"
            onClick={() => onClose && onClose()}
            className="settingsButton settingsButton--secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="settingsButton settingsButton--primary"
          >
            {uploading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </main>
  );
}
