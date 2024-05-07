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
  const [selectedRole, setSelectedRole] = useState<string | null>(roles[0].name);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-full font-inter"
      style={{
        backgroundImage: "url('/images/apply_role_descriptions_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh'
      }}
    >
      <div className="w-full max-w-3xl px-4">
        <div className="flex flex-col items-start text-left mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">Applications</h1>
        </div>
        <div className="flex justify-center gap-16 mb-8 w-full px-8">
          {roles.map((role) => (
            <div
              key={role.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedRole(role.name)}
            >
              <span className="text-white text-xl mb-3">{role.name}</span>
              <img
                src={selectedRole === role.name ? role.activeIcon : role.icon}
                alt={role.name}
                className="w-24 h-24"
              />
            </div>
          ))}
        </div>
        {selectedRole && (
          <div className="text-left w-full text-white p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: roles.find((role) => role.name === selectedRole)?.description || ''
              }}
            />
          </div>
        )}
        <button className="bg-red-700 text-white px-5 py-2.5 text-lg rounded-lg border-none cursor-pointer mt-8">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default RoleDescriptions;
