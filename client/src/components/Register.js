import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTeller } from '../hooks/fetchClients';
import { Input } from './Input';

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
        const stateSetterMap = {
            'first_name': setFirstName,
            'last_name': setLastName,
            'email': setEmail,
            'password': setPassword
        }

        const setStateFunction = stateSetterMap[name];
        if (setStateFunction) {
            setStateFunction(value);
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
                <Input
                    label={'First Name:'}
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={firstName}
                    onChange={handleInputChange}
                />
                <Input
                    label={'Last Name:'}
                    type="last_name"
                    id="last_name"
                    name="last_name"
                    value={lastName}
                    onChange={handleInputChange}
                />
                <Input
                    label={'Email'}
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                />
                <Input
                    label={'Password:'}
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                />
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
