import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTeller } from '../hooks/fetchClients';

export const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { mutate } = useMutation(['createTeller', 'firstName', 'lastName', 'email', 'password'], () => createTeller(firstName, lastName, email, password), {
        onSuccess: (data) => {
            navigator.clipboard.writeText(data.login_id);
            setTimeout(() => {
                toast.success(`Login ID: ${data.login_id}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                toast.info(`Login ID copied to clipboard`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }, 1);
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'first_name') {
            setFirstName(value);
        } else if (name === 'last_name') {
            setLastName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleCreateTeller = (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError(null);
        mutate({ firstName, lastName, email, password });
    };

    return (
        <div className='register-form-container'>
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleCreateTeller}>
                <div className='label-input'>
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={firstName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='label-input'>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="last_name"
                        id="last_name"
                        name="last_name"
                        value={lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='label-input'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='label-input'>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" >
                    Create Teller
                </button>
                <ToastContainer />
                {error && <p>{error}</p>}
            </form>
            <Link to={'/login'}>Go Back To Login</Link>
        </div>
    )
}
