import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';

import './Layer.scss';

class Layer extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object.isRequired,
  }

  render() {
    const { isVisible, layer } = this.props;

    return (
      <div>
        {layer.name}
      </div>
    );
  }
}

export default connect(null, null)(Layer);
