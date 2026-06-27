import i18next from 'i18next';

/**
 * @ignore
 * Returns a translation function (`t`) bound to the global `i18next` singleton.
 *
 * In Web Component multi-instance mode each instance owns its own `i18next.createInstance()`; `apis/setLanguage.js` mirrors the latest language change onto the global singleton. This helper therefore resolves to the language of the most recently active instance, NOT to a specific per-instance i18n object. If two instances on the same page are in different languages, calls made from non-component code will use whichever one most recently called `setLanguage()`.
 *
 * Use this helper from non-component modules (event listeners, redux thunks,
 * helpers, sort comparators, etc.) that cannot call `useTranslation()`.
 * Inside React components always prefer `useTranslation()` from
 * `react-i18next` so the component subscribes to its own provider's i18n
 * instance and re-renders correctly on language change.
 *
 * Centralising the lookup here lets us upgrade the resolution strategy
 * later (e.g. honour a per-call instance id) without touching every
 * callsite.
 */
const getCurrentT = () => i18next.t.bind(i18next);

export default getCurrentT;
