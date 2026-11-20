import { createInstanceScopedState } from 'core/documentViewers';

export const ClickedItemTypes = {
  BUTTON: 'button',
};

const clickMiddleWareState = createInstanceScopedState(() => ({ middleware: undefined }));

export const setClickMiddleWare = (middleware) => {
  clickMiddleWareState.get().middleware = middleware;
};

export const getClickMiddleWare = () => clickMiddleWareState.get().middleware;
