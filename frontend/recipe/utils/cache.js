const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export function getCache(key) {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  const { data, timestamp } = JSON.parse(raw);

  // Expired?
  if (Date.now() - timestamp > CACHE_TTL) {
    sessionStorage.removeItem(key);
    return null;
  }

  return data;
}

export function setCache(key, data) {
  sessionStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
}

export function clearCache(key) {
  sessionStorage.removeItem(key);
}
