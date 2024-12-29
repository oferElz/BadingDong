'use client'; // Required for handling client-side logic

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Homepage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (username === 'student' && password === 'student') {
      router.push('/student');
    } else if (username === 'teacher' && password === 'teacher') {
      router.push('/teacher');
    } else if (username === 'admin' && password === 'admin') {
      router.push('/admin');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-200 via-orange-200 to-red-100">
      <div className="w-full max-w-sm p-6 bg-gray-100 rounded shadow-md border-2 border-gray-300">
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Homepage;
