const KEY = "sd:theme";

export function readTheme() {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (error) {
    /* ignore */
  }
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch (error) {
    return "dark";
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f6f7fb" : "#07080c");
  try {
    window.localStorage.setItem(KEY, theme);
  } catch (error) {
    /* ignore */
  }
}
