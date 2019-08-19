import React from 'react';

import PropTypes from 'prop-types';

import './WatermarkModal.scss';

export default class WatermarkModal extends React.PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    modalClosed: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  componentDidMount() {
    if (this.props.isVisible !== undefined) {
      this.setState({
        isVisible: this.props.isVisible,

      });
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage, don't forget to compare the props
    if (this.props.isVisible !== prevProps.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
      });
    }
  }

  closeModal() {
    this.setState({
      isVisible: false,
    });
    this.props.modalClosed();
  }

  render() {
    const { isVisible } = this.props;

    if (!isVisible) {
      return null;
    }
    return (
      <>
        <div className={'Modal Watermark'} data-element="waterMarkModal" onClick={() => this.closeModal()}>
          test
        </div>
      </>
    );
  }
}