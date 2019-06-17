import actions from 'actions';
 
class header {
  constructor(store) {
    this.store = store;
  }
  getItems() {
    return this.store.getState().viewer.header;
  }
  addItems(newItems, index) {
    this.store.dispatch(actions.addItems(newItems, index));
  }
  removeItems(itemList) {
    this.store.dispatch(actions.removeItems(itemList));
  }
  updateItem(dataElement, newProps) {
    this.store.dispatch(actions.updateItem(dataElement, newProps));
  }
  setItems(items) {
    this.store.dispatch(actions.setItems(items));
  }
  group(dataElement){
    const defaultHeader = this.store.getState().viewer.header;
    let group;
    defaultHeader.forEach(buttonObject => {
      if (buttonObject.dataElement === dataElement) {
        group = buttonObject;
      }
      if (buttonObject.children) {
        buttonObject.children.forEach(childObject => {
          if (childObject.dataElement === dataElement) {
            group = childObject;
          }
        });
      }
    });
    if (!group) {
      console.warn(`${dataElement} is not a valid group button`);
      return;
    }
    let me = this;
    return {
      getItems() {
        return group.children;
      },
      addItems(newItems, index) {
        me.store.dispatch(actions.addItems(newItems, index, group));
      },
      removeItems(itemList) {
        me.store.dispatch(actions.removeItems(itemList, group));
      },
      updateItem(dataElement, newProps) {
        me.store.dispatch(actions.updateItem(dataElement, newProps, group));
      },
      setItems(items) {
        me.store.dispatch(actions.setItems(items, group));
      }
    };
  }
};

export default header;