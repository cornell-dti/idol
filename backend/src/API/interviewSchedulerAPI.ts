import InterviewSchedulerDao from '../dao/InterviewSchedulerDao';

const interviewSchedulerDao = new InterviewSchedulerDao();

// eslint-disable-next-line import/prefer-default-export
export const getAllApplicants = async (): Promise<string[]> => {
  const instances = await interviewSchedulerDao.getAllInstances();
  const applicants = new Set<string>();
  instances
    .filter((inst) => !inst.isArchived)
    .forEach((inst) => inst.applicants.forEach((app) => applicants.add(app)));
  return Array.from(applicants);
};
