import React from 'react';
import PropTypes from 'prop-types';

import ToolTip from './ToolTip';

export default ToolTip;
export const withToolTip = (WrappedComponent, location) => {
  return class WithToolTip extends React.Component {
    static propTypes = {
      title: PropTypes.string
    }

    render() {
      const { title, isDisabled, ...restProps } = this.props;

      return (
        <ToolTip content={title} isDisabled={isDisabled} location={location}>
          <WrappedComponent {...restProps} />
        </ToolTip>
      );
    }
  };
};
