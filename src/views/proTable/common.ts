export const max_length= 200;
export const onlyEnglishStyle = (value: string): boolean => {
  // Regular expression to match only letters (A-Z, a-z), numbers (0-9), and common special characters
	const regex = /^[A-Za-z0-9!@#$%&*()+=._-]+$/;
  return regex.test(value);
};
