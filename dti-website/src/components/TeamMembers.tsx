import HeadshotGrid from './HeadshotGrid';
import PageSection from './PageSection';

type Props = {
  readonly current: readonly NovaMember[];
  readonly past: readonly NovaMember[];
};

export default function TeamMembers({ current, past }: Props): JSX.Element {
  return (
    <div className="team-members-component">
      {current.length > 0 && (
        <PageSection>
          <div className="project-header">Team</div>
          <HeadshotGrid
            members={current.map((info) => ({ info, id: info.netid }))}
          />
        </PageSection>
      )}
      {past.length > 0 && (
        <PageSection>
          <div className="project-header">Former Members</div>
          <HeadshotGrid
            members={past.map((info) => ({ info, id: info.netid }))}
          />
        </PageSection>
      )}
    </div>
  );
}
