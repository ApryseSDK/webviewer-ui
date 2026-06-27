// Vite shim for react-hot-loader/root.
// Vite uses React Fast Refresh via @vitejs/plugin-react, so
// react-hot-loader is not needed. This shim makes `hot(Component)`
// a passthrough so `export default hot(App)` still works.
export const hot = (Component) => Component;
