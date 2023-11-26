import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { login } from '../hooks/fetchClients';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [loginID, setLoginID] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const { mutate } = useMutation(['login', 'loginID', 'password'], () => login(loginID, password), {
        onSuccess: () => {
            setIsLoggedIn(true);
            navigate('/');
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'loginID') {
            setLoginID(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (!loginID || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError(null);
        mutate({ loginID, password })
    };

    return (
        <div>
            {!isLoggedIn && (
                <div className='login-container'>
                    <h2>Login</h2>
                    {error && <p className='login-error'>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="loginID">Login ID:</label>
                            <input
                                type="text"
                                id="loginID"
                                name="loginID"
                                value={loginID}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" >
                            Login
                        </button>
                    </form>
                </div>
            )}
            <div className='register-container'>
                <h2>No login ID?</h2>
                <p>Register a new teller here</p>
                <Link to={'/register'}>Register</Link>
            </div>
        </div>
    );
}

export default Login;
