/**
 * Format store delivery time into human-readable Bengali duration (মিনিট, ঘণ্টা, দিন)
 */
export function formatDeliveryTime(timeStr?: string): string {
  if (!timeStr) return '২০-৩০ মিনিট';

  const str = String(timeStr).trim();

  // If already formatted in hours or days (and not minutes), return as-is
  if (/(ঘণ্টা|ঘন্টা|দিন|Day|Hour|hour|day)/i.test(str) && !/(মিনিট|min)/i.test(str)) {
    return str;
  }

  // Convert Bengali digits to English digits for numeric processing
  const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const enStr = str.replace(/[০-৯]/g, (w) => enDigits[bnDigits.indexOf(w)]);

  const matches = enStr.match(/(\d+)\s*(?:-\s*(\d+))?/);
  if (!matches) {
    return str;
  }

  const minMins = parseInt(matches[1], 10);
  const maxMins = matches[2] ? parseInt(matches[2], 10) : minMins;

  const toBn = (num: number | string): string => {
    return String(num).replace(/[0-9]/g, (w) => bnDigits[enDigits.indexOf(w)]);
  };

  // 1. Less than 60 minutes -> minute
  if (maxMins < 60) {
    if (minMins === maxMins) {
      return `${toBn(minMins)} মিনিট`;
    }
    return `${toBn(minMins)}-${toBn(maxMins)} মিনিট`;
  }

  // 2. 60 minutes to under 1440 minutes (24 hours) -> hour
  if (maxMins < 1440) {
    const minH = Math.floor(minMins / 60);
    const maxH = Math.ceil(maxMins / 60);

    if (minMins < 60) {
      const maxHDecimal = Math.round((maxMins / 60) * 10) / 10;
      return `${toBn(minMins)} মিনিট - ${toBn(maxHDecimal)} ঘণ্টা`;
    }

    if (minH === maxH) {
      return `${toBn(minH)} ঘণ্টা`;
    }

    return `${toBn(minH)}-${toBn(maxH)} ঘণ্টা`;
  }

  // 3. 1440 minutes or more (24 hours+) -> day
  let minD = Math.round(minMins / 1440);
  if (minD < 1) minD = 1;
  let maxD = Math.round(maxMins / 1440);
  if (maxD < minD) maxD = minD;

  if (minD === maxD) {
    return `${toBn(minD)} দিন`;
  }

  return `${toBn(minD)}-${toBn(maxD)} দিন`;
}
