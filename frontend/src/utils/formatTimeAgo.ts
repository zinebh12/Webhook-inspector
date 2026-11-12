export const formatTimeAgo = (date: Date | string): string => {
  // Initialize a default date as the current date
  let _date: Date = new Date();

  // Check if the input is a string and convert it to a Date object
  if (typeof date === "string") {
    _date = new Date(date);
  } else {
    _date = date;
  }

  // Calculate the time difference in seconds
  const seconds: number = Math.floor(
    (new Date().getTime() - _date.getTime()) / 1000,
  );

  // Define intervals for different time units in seconds
  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2628000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Iterate through the intervals and determine the appropriate unit
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval: number = Math.floor(seconds / secondsInUnit);
    if (interval > 1) {
      return `${interval} ${unit}s ago`;
    } else if (interval === 1) {
      return `${interval} ${unit} ago`;
    }
  }

  // If no larger unit is found, return "just now"
  return "just now";
};
