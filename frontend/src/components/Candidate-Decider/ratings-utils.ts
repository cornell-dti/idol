export const ratingToString = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'Strong No';
    case 2:
      return 'No';
    case 3:
      return 'Maybe';
    case 4:
      return 'Yes';
    case 5:
      return 'Strong Yes';
    default:
      throw new Error();
  }
};

export const ratingToColor = (rating: Rating): string => {
  switch (rating) {
    case 0:
      return 'grey';
    case 1:
      return 'red';
    case 2:
      return 'orange';
    case 3:
      return 'yellow';
    case 4:
      return 'olive';
    case 5:
      return 'green';
    default:
      throw new Error();
  }
};
