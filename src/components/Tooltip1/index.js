import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from './Tooltip';

export default Tooltip;
export const withTooltip = (componentLocations = {}) => WrappedComponent => {
  return class WithTooltip extends React.Component {
    static propTypes = {
      title: PropTypes.string,
      isDisabled: PropTypes.bool
    }

    getLocation = () => {
      const { dataElement } = this.props;
      let location = 'bottom';

      if (componentLocations[dataElement]) {
        location = componentLocations[dataElement];
      }

      return location;
    }

    render() {
      const { title, isDisabled, ...restProps } = this.props;

      return (
        <Tooltip content={title} isDisabled={isDisabled} location={this.getLocation()}>
          <WrappedComponent {...restProps} />
        </Tooltip>
      );
    }
  };
};
