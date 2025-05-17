import selectors from 'selectors';
import createModularInstance from 'src/apis/ModularComponents/createModularInstance';

export const getModularComponentInstance = (store) => (component) => {
  const modularComponentInstance = createModularInstance(component, store);

  if (modularComponentInstance?.items) {
    modularComponentInstance.items = modularComponentInstance.items.map((item) => {
      const modularComponent = selectors.getModularComponent(store.getState(), item);
      if (modularComponent.items) {
        return getModularComponentInstance(store)(modularComponent);
      }
      return createModularInstance(modularComponent, store);
    });
  }

  return modularComponentInstance;
};