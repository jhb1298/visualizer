import React, { useState } from 'react';
import bgImage from '../images/bg.jpg';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Basic validation
        if (email.trim() === '' || password.trim() === '') {
            alert('Please enter username and password');
            return;
        }

        fetch('http://localhost:8080/login', {
            method: "POST",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        }).then(res => res.text())
            .then(data => {
                console.log(data)
                if (JSON.parse(data).message === 'successful') {
                    localStorage.setItem('email', JSON.stringify(email));
                    window.location.href = '/code';
                } else {
                    alert("Icorrect Email or Password");
                }
            })
            .catch(err => {
                console.log("Eroor", err)
            })
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="bg-slate-600 bg-opacity-50 rounded-lg p-8 w-1/2 shadow-md text-slate-200">
                <h2 className="text-3xl font-semibold mb-4 text-center border-b-[1px]">Login</h2>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 logInput" />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Password:</label>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2  logInput " />
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleLogin} className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-600">Login</button>
                </div>
                <div className='flex items-center'>
                    <p>Don't have an account?</p>
                    <button
                        className='text-slate-400 ml-2 border-[1px] border-slate-400 p-1px'
                        onClick={() => { window.location.href = '/reg'; }}
                    >
                        Register
                        </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
