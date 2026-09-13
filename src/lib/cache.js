const TTL = 10 * 60 * 1000;
const store = new Map();

function fresh(entry) {
  return entry && Date.now() - entry.at < TTL;
}


export function cached(key, loader) {
  const hit = store.get(key);
  if (fresh(hit)) return hit.promise;
  const promise = loader().catch((error) => {
    store.delete(key);
    throw error;
  });
  store.set(key, { at: Date.now(), promise });
  return promise;
}

export function clearCache() {
  store.clear();
}
