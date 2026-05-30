import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia; provide a minimal stub so components
// that read media queries (e.g. usePrefersReducedMotion) work under test.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
