import actions from 'actions';

export default store => (searchValue, options) => {
  let searchOptions = {};
  if (typeof options === 'string') {
    const modes = options.split(',');
    modes.forEach(mode => {
      searchOptions[lowerCaseFirstLetter(mode)] = true;        
    });
  } else {
    searchOptions = options;
  }

  store.dispatch(actions.searchText(searchValue, searchOptions));
};

const lowerCaseFirstLetter = mode => `${mode.charAt(0).toLowerCase()}${mode.slice(1)}`; 
