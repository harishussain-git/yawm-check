const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatTodayDate() {
  return dateFormatter.format(new Date());
}

export function formatShortDate(date: string | Date) {
  return shortDateFormatter.format(new Date(date));
}

export function getMockHijriDate(date?: string | Date) {
  const value = date ? new Date(date) : new Date();
  const day = value.getDate();

  return `${day} Dhul Qa'dah 1446`;
}
