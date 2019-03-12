import setHeaderItems from '../apis/setHeaderItems';
import { updateTool } from '../redux/actions/exposedActions';

export default store => (toolName, properties) => {
  if (properties.buttonGroup === null){
    setHeaderItems(store)(function(header){
      let alreadyExist = false;
      header.getHeader('default').headers.default.forEach(function(element){
        if (element.toolName === toolName){
          alreadyExist = true;
        }
      });
      if (!alreadyExist){
        header.getHeader('default').get('miscToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: toolName,
          hidden: [ 'tablet', 'mobile' ]
        });
        header.getHeader('tools').get('miscToolGroupButton').insertBefore({
          type: 'toolButton',
          toolName: toolName,
          hidden: [ 'desktop' ]
        });
      }
    });
  } else {
    setHeaderItems(store)(function(header){
      const returnDefaultHeader = header.headers.default.filter(function(element){
        return element.toolName !== toolName;
      });
      header.getHeader('default').update(returnDefaultHeader);
      const returnToolsHeader = header.headers.tools.filter(function(element){
        return element.toolName !== toolName;
      });
      header.getHeader('tools').update(returnToolsHeader);
    });
  }
  store.dispatch(({ type: 'UPDATE_TOOL', payload: { toolName, properties } }));
};