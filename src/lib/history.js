const KEY = "social-downloader:recent";
const LIMIT = 6;

export function readHistory() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, LIMIT) : [];
  } catch (error) {
    return [];
  }
}

export function pushHistory(entry) {
  const next = [entry, ...readHistory().filter((item) => item.value !== entry.value)].slice(
    0,
    LIMIT
  );
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch (error) {
    return next;
  }
  return next;
}

export function clearHistory() {
  try {
    window.localStorage.removeItem(KEY);
  } catch (error) {
    return [];
  }
  return [];
}
