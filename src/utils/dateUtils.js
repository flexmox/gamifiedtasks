import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'None';
  const now = new Date();
  const taskDate = new Date(date);
  if (taskDate > now) {
    return `Due ${formatDistanceToNow(taskDate, { addSuffix: true })}`;
  } else {
    return `${format(taskDate, 'MMM d, yyyy')} at ${format(taskDate, 'h:mm a')}`;
  }
};