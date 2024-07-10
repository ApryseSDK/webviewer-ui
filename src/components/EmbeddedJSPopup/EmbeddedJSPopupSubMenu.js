import React, { useRef, useState } from 'react';

import Icon from 'components/Icon';
import EmbeddedJSPopupMenu from './EmbeddedJSPopupMenu';

const EmbeddedJSPopupSubMenu = ({ title, onClick, popUpMenuItems, scrollTop = 0 }) => {
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [position, setPosition] = useState({ left: undefined, top: undefined });
  const optionRef = useRef();

  const onSubMenuHover = () => {
    setSubMenuOpen(true);
    setPosition({
      left: optionRef.current.clientWidth,
      top: optionRef.current.offsetTop - scrollTop,
    });
  };

  const onSubMenuLeave = () => {
    setSubMenuOpen(false);
    setPosition({
      left: optionRef.current.clientWidth,
      top: 0,
    });
  };

  return (
    <div className="menu-option" ref={optionRef} onMouseEnter={onSubMenuHover} onMouseLeave={onSubMenuLeave}>
      <div>{title}</div>
      {
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}><Icon glyph="ic_chevron_right_black_24px" /></div>
          <EmbeddedJSPopupMenu
            title={`${title}SubMenu`}
            popUpMenuItems={popUpMenuItems}
            isSubOpen={isSubMenuOpen}
            onSelectOption={onClick}
            left={position.left}
            top={position.top}
          />
        </>
      }
    </div>
  );
};

export default EmbeddedJSPopupSubMenu;
