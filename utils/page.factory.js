// utils/page.factory.js

/**
 * Dependency Injection container for Page Objects and Components.
 *
 * How it works:
 *  1. Each page/component class declares its dependencies via a static
 *     `dependencies` array of class references.
 *  2. PageFactory.create(SomeClass) recursively resolves all dependencies,
 *     constructs each instance once, and caches it for the remainder of
 *     the test (singleton-per-test scope).
 *  3. Fixtures expose the factory via `pageFactory` so individual page
 *     fixtures simply call `pageFactory.create(MyPage)`.
 *
 * Example page class:
 *
 *   export class DashboardPage extends BasePage {
 *     static dependencies = [NavbarComponent, ModalComponent];
 *
 *     constructor(page, navbar, modal) {
 *       super(page);
 *       this.navbar = navbar;   // ← injected
 *       this.modal  = modal;    // ← injected
 *     }
 *   }
 *
 * That's it — no manual `new NavbarComponent(page)` anywhere.
 */
export class PageFactory {
  /** @type {Map<Function, object>} */
  #cache = new Map();

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * Resolve a Page/Component class and all its declared dependencies,
   * returning a cached singleton for this test run.
   *
   * @template T
   * @param {new (page: import('@playwright/test').Page, ...deps: any[]) => T} PageClass
   * @returns {T}
   */
  create(PageClass) {
    if (this.#cache.has(PageClass)) {
      return this.#cache.get(PageClass);
    }

    // Recursively resolve each declared dependency first
    const deps = (PageClass.dependencies ?? []).map(Dep => this.create(Dep));

    const instance = new PageClass(this.page, ...deps);
    this.#cache.set(PageClass, instance);
    return instance;
  }

  /**
   * Clear the cache (called automatically at test teardown via fixture).
   * Useful for resetting state between describe blocks if needed.
   */
  clear() {
    this.#cache.clear();
  }
}
