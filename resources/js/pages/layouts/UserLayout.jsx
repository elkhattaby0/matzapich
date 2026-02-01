import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import Header from '../user/Header';
import Footer from '../../components/layout/Footer';
import Profile from '../user/Profile';
import Side from '../user/Side';
import AvatarUploader from '../../components/AvatarUploader';
import axios from 'axios';

export default function UserLayout() {
    const [sideOpen, setSideOpen] = useState(false);
    const [sideTitle, setSideTitle] = useState('Menu');
    const [sideContent, setSideContent] = useState('menu'); // 'menu' | 'settings'

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
    };

    const openSide = (title, contentKey) => {
        setSideTitle(title);
        setSideContent(contentKey);
        setSideOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeSide = () => {
        setSideOpen(false);
        document.body.style.overflow = '';
    };

    const UserMenu = () => (
        <ul className="usermenu">
            <li><i className="fa-solid fa-user"></i> View your profile</li>
            <li><i className="fa-solid fa-heart"></i> Invite friends</li>
            <li><i className="fa-solid fa-bookmark"></i> Bookmarks</li>
            <li onClick={() => openSide('Settings', 'settings')}>
                <i className="fa-solid fa-gear"></i> Settings
            </li>
            <li onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
            </li>
        </ul>
    );

    const Settings = () => {
        const { user, setUser } = useAuth();
        const [uploading, setUploading] = useState(false);

        if (!user) return null;

        const APP_URL = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000';

        const currentAvatarUrl = user.avatar
            ? `${APP_URL}/storage/${user.avatar}`
            : `${APP_URL}/storage/avatars/noavatar.png`;

        const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        };

        const handleAvatarChange = async (compressedImage) => {
            if (!compressedImage || !setUser) return;

            const formData = new FormData();
            formData.append('avatar', compressedImage);

            setUploading(true);
            try {
                const response = await axios.post('/api/user/avatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUser((prev) => ({ ...prev, avatar: response.data.avatar }));
                alert('Avatar uploaded!');
            } catch (error) {
                console.error('Upload error:', error.response?.data || error);
                alert('Failed to upload avatar');
            } finally {
                setUploading(false);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            for (let [key, value] of formData.entries()) {
                if (value === '' || value === null) {
                    formData.delete(key);
                }
            }

            formData.append('_method', 'PUT');

            try {
                const response = await axios.post('/api/user', formData, {
                    headers: { Accept: 'application/json' },
                });

                alert('Settings updated successfully!');
                setUser(response.data.user);
                closeSide(); // close side after save
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
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                <section style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
                    <h3 style={{ marginBottom: '10px' }}>Profile Picture</h3>
                    <AvatarUploader
                        onImageCompressed={handleAvatarChange}
                        currentAvatar={currentAvatarUrl}
                    />
                    {uploading && <p>Uploading...</p>}
                </section>

                {/* Basic Info Section */}
                <section style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
                    <h3 style={{ marginBottom: '10px' }}>Basic Information</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                defaultValue={user.firstName}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                defaultValue={user.lastName}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            defaultValue={formatDateForInput(user.dateOfBirth)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={user.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                background: '#f5f5f5',
                                cursor: 'not-allowed',
                            }}
                        />
                    </div>
                </section>

                {/* Password Section */}
                <section style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e0e0e0' }}>
                    <h3 style={{ marginBottom: '10px' }}>Change Password</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Old Password
                        </label>
                        <input
                            type="password"
                            name="oldPassword"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </section>

                {/* About You Section */}
                <section style={{ marginBottom: '20px' }}>
                    <h3 style={{ marginBottom: '10px' }}>About You</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            rows="4"
                            placeholder="Tell us about yourself..."
                            defaultValue={user.bio}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Relationship Status
                        </label>
                        <select
                            name="socialStatus"
                            defaultValue={user.socialStatus}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        >
                            <option value="">Select status</option>
                            <option value="single">Single</option>
                            <option value="in_relationship">In a relationship</option>
                            <option value="engaged">Engaged</option>
                            <option value="married">Married</option>
                            <option value="complicated">It's complicated</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Gender
                        </label>
                        <select
                            name="gender"
                            defaultValue={user.gender}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            From
                        </label>
                        <input
                            type="text"
                            name="from"
                            placeholder="e.g., Agadir, Morocco"
                            defaultValue={user.from}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Lives in
                        </label>
                        <input
                            type="text"
                            name="livesIn"
                            placeholder="e.g., Agadir, Morocco"
                            defaultValue={user.livesIn}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Work
                        </label>
                        <input
                            type="text"
                            name="work"
                            placeholder="e.g., Software Engineer at Matzapish"
                            defaultValue={user.work}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                            Studied at
                        </label>
                        <input
                            type="text"
                            name="studied"
                            placeholder="e.g., OFPPT"
                            defaultValue={user.studied}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </section>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={closeSide}
                        style={{
                            padding: '10px 20px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            background: '#1877f2',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: '500',
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        );
    };

    const renderSideContent = () => {
        switch (sideContent) {
            case 'settings':
                return <Settings />;
            case 'menu':
            default:
                return <UserMenu />;
        }
    };

    return (
        <>
            <Header onOpenSide={openSide} />
            <Profile />
            <Side
                title={sideTitle}
                isOpen={sideOpen}
                onClose={closeSide}
            >
                {renderSideContent()}
            </Side>
            <Footer />
        </>
    );
}
