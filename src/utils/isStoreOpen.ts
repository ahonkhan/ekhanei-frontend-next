import { Store } from '@/types';

/**
 * Checks if a store is currently open based on its opening hours/schedule.
 * Handles 12-hour (e.g. "10:00 AM", "08:00 PM") and 24-hour (e.g. "10:00", "20:00") formats.
 */
export function isStoreOpenNow(store?: Partial<Store> | null): boolean {
  if (!store) return true;

  // 1. If explicitly not time restricted, store is always open
  if (store.isTimeRestricted === false) {
    return true;
  }

  // Helper to parse time string like "10:00 AM", "08:00 PM", "10:00", "20:00:00" into minutes from midnight (0 to 1439)
  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const cleanStr = timeStr.trim().toUpperCase();

    // Match 12-hour format "10:00 AM" or "8:00 PM" or "08:00PM"
    const match12 = cleanStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = parseInt(match12[2], 10);
      const period = match12[3].toUpperCase();
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    }

    // Match 24-hour format "20:00" or "08:00"
    const match24 = cleanStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24) {
      const hours = parseInt(match24[1], 10);
      const minutes = parseInt(match24[2], 10);
      return hours * 60 + minutes;
    }

    return null;
  };

  let startMinutes: number | null = null;
  let endMinutes: number | null = null;

  if (store.openingStartTime && store.openingEndTime) {
    startMinutes = parseTimeToMinutes(store.openingStartTime);
    endMinutes = parseTimeToMinutes(store.openingEndTime);
  }

  // Try parsing from openingHours or formattedSchedule if start/end missing
  if ((startMinutes === null || endMinutes === null) && (store.openingHours || store.formattedSchedule)) {
    const scheduleStr = store.formattedSchedule || store.openingHours || '';
    // Look for patterns like "10:00 AM - 08:00 PM" or "10:00 AM – 8:00 PM"
    const rangeMatch = scheduleStr.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–—]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (rangeMatch) {
      startMinutes = parseTimeToMinutes(rangeMatch[1]);
      endMinutes = parseTimeToMinutes(rangeMatch[2]);
    }
  }

  if (startMinutes !== null && endMinutes !== null) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } else {
      // Overnight range e.g. 10:00 PM to 04:00 AM
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    }
  }

  // Fallback to store.isOpenNow if provided by API, otherwise default to true
  return store.isOpenNow !== undefined ? store.isOpenNow : true;
}

/**
 * Gets the next available opening time string for a closed store.
 * e.g. "10:00 AM" or extracted start time from schedule.
 */
export function getAvailableAtTime(store?: Partial<Store> | null): string {
  if (!store) return '10:00 AM';

  if (store.openingStartTime) {
    return store.openingStartTime;
  }

  const scheduleStr = store.formattedSchedule || store.openingHours;
  if (scheduleStr) {
    const rangeMatch = scheduleStr.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);
    if (rangeMatch) {
      return rangeMatch[1];
    }
    return scheduleStr;
  }

  return '10:00 AM';
}

