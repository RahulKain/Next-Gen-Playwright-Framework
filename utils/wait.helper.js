// utils/wait.helper.js
/**
 * Poll until conditionFn() is truthy or timeout exceeded.
 * @param {()=>Promise<boolean>} conditionFn
 * @param {number} timeout ms (default 10s)
 * @param {number} interval ms (default 500ms)
 */
export async function waitFor(conditionFn, timeout = 10_000, interval = 500) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await conditionFn()) return;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error(`waitFor: condition not met within ${timeout}ms`);
}
