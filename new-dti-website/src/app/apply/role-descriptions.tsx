'use client';

import React, { useState } from 'react';

interface Role {
    icon: string;
    activeIcon: string;
    name: string;
    description: string;
}

const roles: Role[] = [
    {
        icon: '/icons/product.png',
        activeIcon: '/icons/product_on.png',
        name: 'Product',
        description: `
        <strong style="font-size: 1.5em;">Product Manager Application</strong><br/><br/>
        <strong style="font-size: 1.2em;">What we’re looking for...</strong><br/>
        • excellent organization skills in either Notion, G-Suite, Jira, etc<br/>
        • understanding of the product and design cycle as well as the technical stack<br/>
        • knowledge of DTI’s culture and product branding<br/>
        • eagerness to develop and maintain team culture!<br/><br/>
        <strong style="font-size: 1.2em;">Responsibilities at a glance...</strong><br/>
        • delivering the product by guiding products throughout their execution cycle<br/>
        • bridging the communication gaps between designers and developers<br/>
        • prioritizing requirements and tasks for delivery<br/>
        • collaborating and working with other student organizations on campus
      `,
    },
    {
        icon: '/icons/design.png',
        activeIcon: '/icons/design_on.png',
        name: 'Design',
        description: `
        <strong style="font-size: 1.5em;">Design Application</strong><br/><br/>
        <strong style="font-size: 1.2em;">What we’re looking for...</strong><br/>
        • knowledge of product thinking, empathy and creativity to solve problems<br/>
        • openness to feedback and willingness to critique<br/>
        • case study/portfolio project recommended<br/>
        • experience in Figma, Sketch, Photoshop or similar recommended<br/><br/>
        <strong style="font-size: 1.2em;">Responsibilities at a glance...</strong><br/>
        • make high-level strategic decisions for the product you’re working on<br/>
        • conduct user and market research, interviewing target audiences<br/>
        • design low, medium, high fidelity mockups, prototypes<br/>
        • iterate based on critique, feedback and user testing
      `,
    },
    {
        icon: '/icons/development.png',
        activeIcon: '/icons/development_on.png',
        name: 'Development',
        description: `
        <strong style="font-size: 1.5em;">Developer Application</strong><br/><br/>
        <strong style="font-size: 1.2em;">What we’re looking for...</strong><br/>
        • a curious, inventive and communicative investigator<br/>
        • eagerness to learn new technologies and applications<br/>
        • experience in computer science or app/web development (specific technologies will be taught in DTI, so no expert knowledge required!)<br/><br/>
        <strong style="font-size: 1.2em;">Responsibilities at a glance...</strong><br/>
        • work as the backbone of the project to bring concepts to reality<br/>
        • front-end developers: implement mockups, balancing project constraints<br/>
        • back-end developers: organize and manipulate processed data to create <br/> 
        informed and practical data sources
      `,
    },
    {
        icon: '/icons/business.png',
        activeIcon: '/icons/business_on.png',
        name: 'Business',
        description: `
        <strong style="font-size: 1.5em;">Business Application</strong><br/><br/>
        <strong style="font-size: 1.2em;">What we’re looking for...</strong><br/>
        • passion for projects that focus on impact and initiative<br/>
        • creativity to create new product visions with innovation<br/>
        • takes initiative to connect with members of the DTI community and beyond<br/>
        • knowledge of coding or business is NOT required<br/><br/>
        <strong style="font-size: 1.2em;">Responsibilities at a glance...</strong><br/>
        • develop strategies for teams to outreach and market their products<br/>
        • reach out to corporate partners to become Sponsors for DTI<br/>
        • innovate processes and create new team building events to boost team culture<br/>
        • bolster social media presence and enhance the presence of DTI online
      `,
    },
];

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
            <h1 className="text-4xl font-bold text-white mb-10 text-left w-full text-center">Applications</h1>
            <div className="flex justify-center gap-4 mb-8 w-full px-8">
                {roles.map((role) => (
                    <div key={role.name} className="flex flex-col items-center cursor-pointer" onClick={() => setSelectedRole(role.name)}>
                        <span className="text-white text-xl mb-2">{role.name}</span>
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
