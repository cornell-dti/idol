'use client';

import React, { useState } from 'react';
import data from './role-descriptions.json';

interface Role {
    icon: string;
    activeIcon: string;
    name: string;
    description: string;
}
const roles = data.roles as Role[];

const RoleDescriptions: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen"
            style={{
                backgroundImage: "url('/images/role_descriptions.png')",
                backgroundSize: 'cover'
            }}
        >
            <div className="flex justify-center gap-12 mb-8 w-full px-8">
                <h1 className="text-4xl font-bold text-white mb-10 text-left">Applications</h1>
                {roles.map((role) => (
                    <div key={role.name} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedRole(role.name)}>
                        <span className="text-white text-xl mb-3">{role.name}</span>
                        <img src={selectedRole === role.name ? role.activeIcon : role.icon} alt={role.name} className="w-24 h-24" />
                    </div>
                ))}
            </div>
            {selectedRole && (
                <div className="text-left w-full md:w-3/4 xl:w-1/2 mx-auto text-white p-4">
                    <div dangerouslySetInnerHTML={{ __html: roles.find((role) => role.name === selectedRole)?.description || '' }} />
                </div>
            )}
            <button
                style={{
                    backgroundColor: '#A52424',
                    color: 'white',
                    padding: '10px 20px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '2em',
                }}
            >
                Apply Now
            </button>
        </div>
    );
};

export default RoleDescriptions;
