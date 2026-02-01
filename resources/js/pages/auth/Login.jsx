import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Redirect from "../../components/common/Redirect";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({
                email: formData.email,
                password: formData.password
            });

            if (response.user.is_admin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/user');
            }

        } catch (err) {
            if (
                err.response?.status === 403 &&
                err.response?.data?.needs_verification
            ) {
                setError('Please verify your email before logging in.');

                navigate('/verify-email', {
                    state: { email: formData.email },
                });

            } else if (err.response?.status === 403) {

                setError('Your account has been deactivated or banned.');
            } else if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Invalid email or password.');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Welcome back">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div
                        className="error-message"
                        style={{
                            padding: '12px',
                            marginBottom: '16px',
                            backgroundColor: '#fee',
                            color: '#c33',
                            borderRadius: '4px',
                            border: '1px solid #fcc',
                        }}
                    >
                        {error}
                    </div>
                )}

                <Input
                    label="Email"
                    placeholder="jhon@example.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    label="Passowrd"
                    placeholder="****"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <Button
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <Redirect path="/register">Sign up for Matzapich</Redirect>
        </AuthLayout>
    );
}
