import Layout from '../../components/Layout';
import styles from './index.module.css';

const CollegeStat = ({num, data}: CollegeStat): JSX.Element => (
  <div style={{display: 'flex', flexDirection: 'row', marginBottom: '30px'}}>
    <div className={styles.statLeftVerticalBar}/>
    <div style={{marginLeft: '20px', marginTop: '20px'}}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statData}>{data}</div>
    </div>

  </div>
);

const SubTeamStat = ({color, subteam}: SubTeamStat): JSX.Element => (
  <div style={{position: 'relative', display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
  <div className={styles.statSubTeamsColor} style={{ borderColor: color}}/>
  <div className={styles.statSubTeams}>{subteam}</div>
</div>
);

type CollegeStat = {
  num: string;
  data: string;
};

type SubTeamStat = {
  color: string;
  subteam: string;
};

const collegeStats: CollegeStat[] = [
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
]

const subTeamStats: SubTeamStat[] = [
  {
    color: '#FFBCBC',
    subteam: 'Design'
  },
  {
    color: '#FE6D6D',
    subteam: 'Development'
  },
  {
    color: '#FFFFFF',
    subteam: 'Product'
  },
  {
    color: '#FE8A89',
    subteam: 'Business'
  },
  {
    color: '#484848',
    subteam: 'Leads'
  }
]

const IndexPage = (): JSX.Element => (
  <Layout>
    <div className={styles.leftRedShadow}></div>
    <div className={styles.rightRedShadow}></div>
    <div style={{ backgroundColor: '#1C1C1C', height: '300vh', textAlign: 'center' }}>
      <div>
        <div className={styles.ourTeam}>
          <div className={styles.our}>OUR</div>
          <div className={styles.team}>TEAM</div>
        </div>
        <img className={styles.teamMiddleRight} src={'/static/team/team_middle_right.svg'}></img>
        <div className={styles.workingTogether}>
          <div style={{ color: '#AEAEAE', paddingRight: '15px'}}>Working</div> 
          <div style={{ color: 'white'}}>Together</div>
        </div>
        <div className={styles.paragraph} style={{left: '700px', top: '-200px', width: '370px'}}>We are Cornell Design & Tech Initiative. But individually, we are a <b>talented</b>, <b>diverse</b> group of students from different colleges and countries striving to make a difference in our <b>community</b>.</div>
        <img className={styles.leftShapes} src={'/static/team/left_shapes.svg'}></img>
        <img className={styles.rightShapes} src={'/static/team/right_shapes.svg'}></img>
        <img className={styles.teamTopLeft} src={'/static/team/team_top_left.svg'}></img>
      </div>
      
      <div>
        <img className={styles.teamBottomLeft} src={'/static/team/team_bottom_left.svg'}></img>
        <div className={styles.diversity}>
          <div style={{ color: 'white'}}>Diversity</div>
        </div>
        <div className={styles.paragraph} style={{left: '715px', top: '-450px', width: '510px'}}>
        More than just being inclusive, our team strives to bring as many backgrounds and perspectives together to solve community problems. These statistics come from recruiting across campus and seeking applicants with the best skills and potential for growth on the team. Updated Fall 2022.
        </div>
      </div>
 
      <div style={{position: 'relative', top: '-500px'}}>
        <img className={styles.donutPlaceholder} src={'/static/team/donut_placeholder.png'}></img>
        <div style={{position: 'relative', left: '100px', top: '-250px'}}>
          {collegeStats.map((collegeStat) =>
            <CollegeStat num={collegeStat.num} data={collegeStat.data}/>
          )}
        </div>
        <div style={{position: 'relative', top: '-650px', left: '1100px'}}>
        {subTeamStats.map((subTeamStat) => 
          <SubTeamStat color={subTeamStat.color} subteam={subTeamStat.subteam}/>
          )}
        </div>
      </div>
    </div>
    </Layout>
);

export default IndexPage;