import type { ReactNode } from 'react';

type RoleDescriptionCardProps = {
  role: string;
  skills: string;
  responsibilities: string;
};

export default function RoleDescriptionCard({
  role,
  skills,
  responsibilities
}: RoleDescriptionCardProps) {
  return (
    <div className="rounded-lg border-1 border-border-1 flex flex-col">
      <div className="p-4 bg-background-2">
        <h3 className="h5">{role} application</h3>
      </div>

      <div className="p-4">
        <h4 className="p">Skills</h4>
        <ul>
          <li>{skills}</li>
        </ul>
      </div>

      <div className="p-4">
        <h4 className="p">Responsibilities</h4>
        <ul>
          <li>{responsibilities}</li>
        </ul>
      </div>
    </div>
  );
}
