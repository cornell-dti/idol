import Layout from '../../components/Layout';
import styles from './index.module.css';

const CollegeStat = ({ num, data }: CollegeStatProp): JSX.Element => (
  <div className={styles.statCollege}>
    <div className={styles.statLeftVerticalBar} />
    <div className={styles.statNumStatData}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statData}>{data}</div>
    </div>
  </div>
);

const SubTeamStat = ({ stroke, subteam }: SubTeamStatProp): JSX.Element => (
  <div className={styles.statCollege}>
    <div className={styles.statSubTeamsColor} style={{ borderColor: stroke }} />
    <div className={styles.statSubTeams}>{subteam}</div>
  </div>
);

type CollegeStatProp = {
  num: string;
  data: string;
};

type SubTeamStatProp = {
  stroke: string;
  subteam: string;
  value?: number;
};

const collegeStats: CollegeStatProp[] = [
  {
    num: '35%',
    data: 'Underclassmen'
  },
  {
    num: '13',
    data: 'Different majors'
  },
  {
    num: '5',
    data: 'Represented colleges'
  }
];

const subTeamStats: SubTeamStatProp[] = [
  {
    stroke: '#FFBCBC',
    subteam: 'Design',
    value: 15
  },
  {
    stroke: '#FF4C4C',
    subteam: 'Development',
    value: 45
  },
  {
    stroke: '#FFFFFF',
    subteam: 'Product',
    value: 22
  },
  {
    stroke: '#B7B7B7',
    subteam: 'Business',
    value: 6
  },
  {
    stroke: '#484848',
    subteam: 'Leads',
    value: 12
  }
];

const IndexPage = (): JSX.Element => (
  <Layout>
    <div className={styles.viewportCropper}>
      <div className={styles.leftRedShadow} />
      <div className={styles.rightRedShadow} />
      <div className={styles.background}>
        <div>
          <div className={styles.ourTeam}>
            <div className={styles.our}>OUR</div>
            <div className={styles.team}>TEAM</div>
          </div>
          <img
            className={styles.teamMiddleRight}
            src={'/static/team/team_middle_right.svg'}
            alt={'Team'}
          />
          <div className={styles.workingTogether}>
            <div className={styles.working}>Working</div>
            <div style={{ color: 'white' }}>Together</div>
          </div>
          <div
            className={styles.paragraph}
            style={{ left: '700px', top: '-200px', width: '370px' }}
          >
            We are Cornell Design & Tech Initiative. But individually, we are a <b>talented</b>,{' '}
            <b>diverse</b> group of students from different colleges and countries striving to make
            a difference in our <b>community</b>.
          </div>
          <img className={styles.leftShapes} src={'/static/team/left_shapes.svg'} alt={'Shapes'} />
          <img
            className={styles.rightShapes}
            src={'/static/team/right_shapes.svg'}
            alt={'Shapes'}
          />
          <img
            className={styles.teamTopLeft}
            src={'/static/team/team_top_left.svg'}
            alt={'Team'}
          />
        </div>

        <div>
          <img
            className={styles.teamBottomLeft}
            src={'/static/team/team_bottom_left.svg'}
            alt={'Team'}
          />
          <div className={styles.diversity}>
            <div style={{ color: 'white' }}>Diversity</div>
          </div>
          <div
            className={styles.paragraph}
            style={{ left: '715px', top: '-450px', width: '510px' }}
          >
            More than just being inclusive, our team strives to bring as many backgrounds and
            perspectives together to solve community problems. These statistics come from recruiting
            across campus and seeking applicants with the best skills and potential for growth on
            the team. Updated Fall 2022.
          </div>
        </div>

        <div className={styles.teamStats}>
          <img
            className={styles.donutPlaceholder}
            src={'/static/team/donut_placeholder.svg'}
            alt={'Donut Team Stats Chart'}
          />
          <div className={styles.collegeStats}>
            {collegeStats.map((collegeStat) => (
              <CollegeStat num={collegeStat.num} data={collegeStat.data} />
            ))}
          </div>
          <div className={styles.subteamStats}>
            {subTeamStats.map((subTeamStat) => (
              <SubTeamStat stroke={subTeamStat.stroke} subteam={subTeamStat.subteam} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default IndexPage;
