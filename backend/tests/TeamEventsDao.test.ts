import TeamEventsDao from "./dao/TeamEventsDao"; 

const jaggerData : IdolMember = {
    graduation: "May 2021",
    website: "https://jagger.netlify.app/",
    subteams: ["leads", "dev-leads"],
    formerSubteams: ["idol"],
    github: "https://github.com/JBoss925/",
    linkedin: "https://www.linkedin.com/in/jagger-brulato-896968149/",
    hometown: "Mooresville, NC",
    minor: null,
    roleDescription: "Lead",
    firstName: "Jagger",
    email: "jb2375@cornell.edu",
    major: "Computer Science",
    netid: "jb2375",
    doubleMajor: "Economics",
    lastName: "Brulato",
    about: "Hey! I'm Jagger. I'm a senior majoring in CS and Economics. I like to make funk-fusion music, and I do a lot of board sports. I also play a lot of chess (d4 > e4, @Fischer) and Tetris.",
    role: "lead"
}

const mockTeamEvent : TeamEvent = {
  name: "te1",
  attendees: [jaggerData],
  uuid: ""
}

test('Add new event', () => {
  return TeamEventsDao.createTeamEvent(mockTeamEvent).then(() => {
    TeamEventsDao.getAllTeamEvents().then((event) => {
      expect(event).toEqual([mockTeamEvent]);
    });
  });
});