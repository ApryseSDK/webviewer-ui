export const ClickedItemTypes = {
  BUTTON: 'button',
};

let clickMiddleWare;

export const setClickMiddleWare = (middleware) => {
  clickMiddleWare = middleware;
};

export const getClickMiddleWare = () => clickMiddleWare;
