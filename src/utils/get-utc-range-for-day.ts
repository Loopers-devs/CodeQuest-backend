import { startOfDay, endOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export function getStartEndUTC(dateStr: string, tz = 'America/Santiago') {
  const localDate = new Date(`${dateStr}T12:00:00`);
  const startUtc = fromZonedTime(startOfDay(localDate), tz);
  const endUtc = fromZonedTime(endOfDay(localDate), tz);

  console.log(startUtc.toISOString(), endUtc.toISOString());
  return { startUtc, endUtc };
}
