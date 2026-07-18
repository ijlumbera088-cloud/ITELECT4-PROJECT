import React from 'react';

interface UserCardProps {
    name: string;
    email: string;
    role: string;
}

export const UserCard: React.FC<UserCardProps> = (props: UserCardProps) => {
    const { name, email, role } = props;
    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
            <h3>{name}</h3>
            <p>Email: {email}</p>
            <p>Role: {role}</p>
        </div>
    );
};