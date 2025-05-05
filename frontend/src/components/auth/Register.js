import React, {useState} from 'react';
import {useAuth} from '../../contexts/AuthContext';
import Button from "@mui/joy/Button";
import Alert from '@mui/material/Alert';


const Register = ({onSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const {register, error} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            return;
        }

        setLoading(true);

        try {
            await register(username, password);
            setUsername('');
            setPassword('');
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {
                    loading ? (<Button loading></Button>) : (<Button type="submit">Register</Button>)
                }
            </form>
        </div>
    );
};

export default Register;