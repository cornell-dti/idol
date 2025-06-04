type RoleDescriptionCardProps = {
  role: string;
  skills: string[];
  responsibilities: string[];
};

export default function RoleDescriptionCard({
  role,
  skills,
  responsibilities
}: RoleDescriptionCardProps) {
  return (
    <div className="min-[940px]:w-200 w-full flex flex-col">
      <div className="p-4 bg-background-2 border-b-1 border-border-1">
        <h3 className="h5">{role} application</h3>
      </div>

      <div className="flex flex-col gap-1 p-4 border-b-1 border-border-1">
        <h4 className="h6">What we're looking for:</h4>
        <ul className="list-disc pl-5">
          {skills.map((skill, index) => (
            <li key={index} className="text-foreground-3">
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h4 className="h6">Responsibilities at a glance:</h4>
        <ul className="list-disc pl-5">
          {responsibilities.map((resp, index) => (
            <li key={index} className="text-foreground-3">
              {resp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
