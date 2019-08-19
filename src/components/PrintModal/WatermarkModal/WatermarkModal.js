import React from 'react';

import PropTypes from 'prop-types';

import './WatermarkModal.scss';

export default class WatermarkModal extends React.PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    //Typical usage, don't forget to compare the props
    if (this.props.isVisible !== prevProps.isVisible) {
      console.log(prevProps);
      this.setState({
        isVisible: this.props.isVisible,
      });
    }
   }

  render() {
    return (
      <>
      <div>Hi! I'm the watermark modal</div>
      </>
    );
  }
}