import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { ITEM_TYPE } from 'src/constants/customizationVariables';
import DraggableContainer from '../ModularComponents/DraggableContainer';
import selectors from 'selectors';
import Icon from '../Icon';
const DraggableTool = (props) => {
  const { dataElement, toolName } = props;
  const toolButtonObject = useSelector((state) => selectors.getToolButtonObject(state, toolName), shallowEqual);

  return (
    <DraggableContainer
      dataElement={dataElement}
      type={'baseToolButton'}
      isInEditorPanel={true}
      toolName={toolName}
    >
      <Icon glyph={toolButtonObject.img} />
    </DraggableContainer>
  );

};

const ToolsSection = () => {
  const modularComponents = useSelector((state) => state.viewer.modularComponents);
  const modularComponentsKeys = Object.keys(modularComponents);

  const tools = modularComponentsKeys.filter((key) => modularComponents[key].type === ITEM_TYPE.TOOL_BUTTON);

  return tools.map((item, index) => {
    const component = {
      ...modularComponents[item],
      dataElement: `${item}-editor-panel`,
    };
    return (
      <DraggableTool key={index} {...component} />
    );
  });
};

export default ToolsSection;