import React from 'react';
import Icon from './Icon';

export default {
  title: 'Components/Icon',
  component: Icon,
};

export function Basic() {
  return (
    <div>
      <Icon glyph={'icon-menu-checkmark'} />
    </div>
  );
}

export function Colorized() {
  return (
    <div>
      <Icon glyph={'icon-menu-checkmark'} color={'red'} />
      <Icon glyph={'icon-menu-checkmark'} color={'#0000FF'} />
    </div>
  );
}

export function Disabled() {
  return (
    <div>
      <Icon glyph={'icon-menu-checkmark'} color={'red'} />
      <Icon glyph={'icon-menu-checkmark'} disabled color={'red'} />
    </div>
  );
}
