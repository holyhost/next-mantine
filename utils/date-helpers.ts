import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export function formatDate(value: Date, format = 'MMM DD, YYYY') {
  return dayjs(value).format(format);
}

export function formatDateMin(value: Date) {
  if (dayjs().isSame(value, 'day')) return dayjs(value).format('h:mma');
  if (dayjs().isSame(value, 'week')) return dayjs(value).format('dddd h:mma');
  if (dayjs().isSame(value, 'month')) return dayjs(value).format('MMM D h:mma');
  if (dayjs().isSame(value, 'year')) return dayjs(value).format('MMM D h:mma');
  return dayjs(value).format('MMM D, YYYY h:mma');
}

// Deprecated: Use DaysFromNow component instead
export function daysFromNow(
  value: Date,
  options: { withoutSuffix?: boolean } = { withoutSuffix: false }
) {
  const { withoutSuffix } = options;

  return dayjs(value).fromNow(withoutSuffix);
}

export function increaseDate(value: Date, duration: number, unit: dayjs.ManipulateType) {
  return dayjs(value).add(duration, unit).toDate();
}

export function decreaseDate(value: Date, duration: number, unit: dayjs.ManipulateType) {
  return dayjs(value).subtract(duration, unit).toDate();
}

export function isFutureDate(value: Date) {
  return dayjs().isBefore(value);
}


export function isBetweenToday(value: Date) {
  const today = dayjs();
  return dayjs(value).isBetween(today.startOf('day'), today.clone().endOf('day'), null, '[]');
}

export const aDayAgo = dayjs().subtract(1, 'day').toDate();
