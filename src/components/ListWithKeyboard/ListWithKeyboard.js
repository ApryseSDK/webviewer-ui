import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

// import keyboardJS from 'keyboardjs';

const mod = (v, n) => {
  return ((v % n) + n) % n;
};

export default class ListWithKeyboard extends React.PureComponent {
  static propTypes = {
    children: PropTypes.array,
  }

  selectionIndex = null;
  itemRefs = [];

  componentDidMount() {
    // keyboardJS.bind('up', this.moveUp);
    // keyboardJS.bind('down', this.moveDown);
  }

  componentWillUnmount() {
    // keyboardJS.unbind('up', this.moveUp);
    // keyboardJS.unbind('down', this.moveDown);
  }

  focus = selectionIndex => {
    let itemRef = this.itemRefs[selectionIndex];
    while (itemRef && itemRef.getWrappedInstance) {
      itemRef = itemRef.getWrappedInstance();
    }
    itemRef && itemRef.focus && itemRef.focus();
  }

  move = direction => {
    const { data } = this.props;
    if (this.selectionIndex === null) {
      this.selectionIndex = 0;
    } else {
      this.selectionIndex = mod(this.selectionIndex + direction, data.length);
    }
    this.focus(this.selectionIndex);
  }

  moveUp = () => {
    this.move(-1);
  }

  moveDown = () => {
    this.move(1);
  }

  render() {
    const { data, renderItem, renderItemSeparator, keyExtractor } = this.props;

    return (
      <Fragment>
        {data.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item) : index;
          return (
            <Fragment key={key}>
              {renderItemSeparator && renderItemSeparator(data, item)}
              {renderItem(item, index, ref => this.itemRefs[index] = ref)}
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}
