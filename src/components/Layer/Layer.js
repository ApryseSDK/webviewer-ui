import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Input from 'components/Input';

import './Layer.scss';

class Layer extends React.PureComponent {
  static propTypes = {
    layer: PropTypes.object.isRequired,
  }


  constructor() {
    super();
    this.wholeWordInput = React.createRef();
  }


  render() {
    const { layer } = this.props;

    return (
      <div className="Layer">
        <Input id={layer.name} type="checkbox" label={layer.name} />
      </div>
    );
  }
}

export default connect(null, null)(Layer);
