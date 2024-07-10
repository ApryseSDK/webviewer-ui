import React from 'react';

const EmbeddedJSPopupMenuOption = ({ title, onClick }) => {
  if (title === '-') {
    return <hr/>;
  }

  const onOptionClick = () => {
    if (onClick) {
      onClick(title);
    }
  };

  return (
    <div className="menu-option" onClick={onOptionClick}>
      <div>{title}</div>
    </div>
  );
};

export default EmbeddedJSPopupMenuOption;
