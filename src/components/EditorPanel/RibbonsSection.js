import React from 'react';
import { useSelector } from 'react-redux';
import { ITEM_TYPE } from 'src/constants/customizationVariables';
import InnerItem from '../ModularComponents/InnerItem';

const RibbonsSection = () => {
  const modularComponents = useSelector((state) => state.viewer.modularComponents);
  const modularComponentsKeys = Object.keys(modularComponents);

  const ribbons = modularComponentsKeys.filter((key) => modularComponents[key].type === ITEM_TYPE.RIBBON_ITEM);

  return ribbons.map((item, index) => {
    const component = {
      ...modularComponents[item],
      dataElement: `${item}-editor-panel`,
    };
    return (
      <InnerItem {...component} isInEditorPanel={true} key={`${item}-${index}`} />
    );
  });
};

export default RibbonsSection;