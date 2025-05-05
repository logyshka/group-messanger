import React, {useState} from 'react';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

const AuthPage = ({onLoginSuccess}) => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);

    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {isLogin ? (
                    <>
                        <Login onSuccess={onLoginSuccess}/>
                        <p className="auth-toggle">
                            Don't have an account?{' '}
                            <button onClick={toggleForm} className="auth-toggle-button">
                                Register
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <Register onSuccess={() => setIsLogin(true)}/>
                        <p className="auth-toggle">
                            Already have an account?{' '}
                            <button onClick={toggleForm} className="auth-toggle-button">
                                Login
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthPage;