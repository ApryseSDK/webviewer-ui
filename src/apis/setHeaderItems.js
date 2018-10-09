import actions from 'actions';

export default store => callback => {
  const state = store.getState();
  const headerGroups = ['default', 'tools'];
  let header = Object.create(Header).initialize(state);

  callback(header);
  headerGroups.forEach(headerGroup => {
    store.dispatch(actions.setHeaderItems(headerGroup, [ ...header.getItems(headerGroup) ]));
  });
};

const Header = {
  initialize(state) {
    this.state = state;
    this.headerGroups = ['default', 'tools'];
    this.headerGroup = 'default'; 
    this.headers = state.viewer.headers;
    this.items = this.headers[this.headerGroup];
    this.index = -1;

    return this;
  },
  getHeader(headerGroup) {
    if (this.headerGroups.includes(headerGroup)) {
      this.update(this.items);
      this.headerGroup = headerGroup;
      this.items = this.headers[headerGroup];
    } else {
      console.warn('Header must be either default or tools');
    }
    
    return this;
  },
  get(dataElement) {
    this.index = this.getIndexOfElement(dataElement);
    
    if (!this.dataElementExists()) {
      console.warn(`${dataElement} does not exist in current header`);
    }

    return this;
  },
  insertBefore(newItem) {
    if (!this.dataElementExists()) {
      console.warn('Please use .get(dataElement) first before use insertBefore');
    } else {
      this.items.splice(this.index, 0, newItem);
    }

    return this.update(this.items);
  },
  insertAfter(newItem) {
    if (!this.dataElementExists()) {
      console.warn('Please use .get(dataElement) first before use insertAfter');
    } else {
      this.items.splice(this.index+1, 0, newItem);
    }

    return this.update(this.items);    
  },
  delete(dataElement) {
    const index = this.getIndexOfElement(dataElement);
    const dataElementExists = index !== -1;

    if (!dataElementExists) {
      console.warn(`${dataElement} does not exist in current header`);
    } else {
      this.deleteElementAtIndex(index);
    }

    return this.update(this.items);
  },
  deleteElementAtIndex(index) {
    if (index === this.index) {
      this.index = -1;
    }
    this.items.splice(index, 1);
  },
  shift() {
    this.items.shift();

    return this.update(this.items);
  },
  unshift(...newItems) {
    this.items.unshift(...newItems);
    
    return this.update(this.items);
  },
  push(...newItems) {
    this.items.push(...newItems);
    
    return this.update(this.items);
  },
  pop() {
    this.items.pop();

    return this.update(this.items);
  },
  update(items) {
    this.items = items;
    this.headers[this.headerGroup] = items;
    
    return this;
  },
  getIndexOfElement(dataElement) {
    return this.items.findIndex(item => {
      let dataElementOfItem;
      
      if (item.type === 'toolButton') {
        dataElementOfItem = this.state.viewer.toolButtonObjects[item.toolName].dataElement;
      } else {
        dataElementOfItem = item.dataElement;
      }
      
      return dataElementOfItem === dataElement;
    });  
  },
  getItems(headerGroup = this.headerGroup) {
    return [ ...this.headers[headerGroup] ];
  },
  dataElementExists() {
    return this.index !== -1;
  }
};