import { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Grid from "../../components/common/Grid";
import Select from "../../components/common/Select";
import Redirect from "../../components/common/Redirect";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        password: '',
        password_confirmation: ''
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


        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match!');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        
        try {
            const { passwordConfirmed, ...userData } = formData;
            await register(userData);
            
            navigate('/verify-email', {
                state: { email: formData.email },
            });
        } catch(err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join('\n');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account">
            <form onSubmit={handleSubmit} className="register">
                {error && (
                    <div className="error-message" style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '4px',
                        border: '1px solid #fcc'
                    }}>
                        {error}
                    </div>
                )}
                <Grid nbr={2}>
                    <Input 
                        label="First Name"
                        placeholder="John"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    
                    <Input 
                        label="Last Name"
                        placeholder="Doe"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid nbr={2}>
                    <Select 
                        label="Gender"
                        name="gender"
                        placeholder="Select Gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' }
                        ]}
                    />

                    <Input 
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </Grid>

                <Input 
                    label="Email"
                    placeholder="john@example.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <Grid nbr={2}>                
                    <Input 
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    
                    <Input 
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                    />
                </Grid>

                <Button 
                    type="submit"
                    disabled={
                        loading ||
                        !formData.firstName || 
                        !formData.lastName || 
                        !formData.gender || 
                        !formData.dateOfBirth || 
                        !formData.email || 
                        !formData.password || 
                        !formData.password_confirmation
                    }
                > 
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </form>
            <Redirect path='/login'>Already have an account?</Redirect>
        </AuthLayout>
    );
}
