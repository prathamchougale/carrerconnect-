import React from 'react'

const PasswordStrength = ({ password }) => {
    const getStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = getStrength(password);
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1 h-1.5">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`flex-1 rounded-full ${level <= strength ? colors[strength - 1] : 'bg-gray-200'}`}
                    />
                ))}
            </div>
            <p className={`text-xs mt-1 ${strength <= 2 ? 'text-red-500' : strength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                {labels[strength - 1] || 'Very Weak'}
            </p>
        </div>
    );
};

export default PasswordStrength;