import { useState, useEffect } from 'react';

function useAuth() {
    const [user, setUser] = useState(null);

    // Load user from localStorage on initial render
    useEffect(() => {
        let user = localStorage.getItem('user')
        if (!user) {
            return;
        }
        const savedUser = JSON.parse(user);
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    // Function to handle login
    const login = (userData: any) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return { user, login, logout };
}

export default useAuth;

