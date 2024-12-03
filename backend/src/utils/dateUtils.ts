export default function getCurrentSemester() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const semester = month >= 1 && month <= 6 ? 'Spring' : 'Fall';

  return `${semester} ${year}`;
}
