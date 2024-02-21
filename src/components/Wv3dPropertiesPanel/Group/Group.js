import React, { useState, useMemo } from 'react';
import Icon from 'components/Icon';
import PropertyKeyValuePair from '../PropertyKeyValuePair/PropertyKeyValuePair';
import './Group.scss';

const Group = (props) => {
  const { name, data, open } = props;

  const [isActive, setIsActive] = useState(open);
  const downArrow = 'ic_chevron_down_black_24px';
  const rightArrow = 'ic_chevron_right_black_24px';

  const onClick = () => {
    setIsActive(!isActive);
  };

  const elements = useMemo(() => {
    return Object.entries(data).map((entity) => (
      <PropertyKeyValuePair key={entity[0]} name={entity[0]} value={entity[1]} />
    ));
  }, [data]);

  return (
    <div data-element="Group">
      <div className="group-title">
        <div onClick={onClick}>
          <Icon glyph={`${isActive ? downArrow : rightArrow}`} />
        </div>
        <span>{name}</span>
      </div>

      <div className={`dropdown ${isActive ? 'active' : 'inactive'}`}>{elements}</div>
    </div>
  );
};

export default React.memo(Group);
