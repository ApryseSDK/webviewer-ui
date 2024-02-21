import React from 'react';
import ToggleElementButton from '../ToggleElementButton';

const MenuToggleButton = () => {
  return (
    <ToggleElementButton
      dataElement="menu-toggle-button"
      className="menuToggleButton"
      title="component.menuOverlay"
      disabled={false}
      img="ic-hamburger-menu"
      toggleElement="MainMenuFlyout"
    />
  );
};

export default MenuToggleButton;
