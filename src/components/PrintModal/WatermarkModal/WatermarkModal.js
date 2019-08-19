import React from 'react';

import PropTypes from 'prop-types';

import Input from 'components/Input';

import './WatermarkModal.scss';

export default class WatermarkModal extends React.PureComponent {

  static propTypes = {
    isVisible: PropTypes.bool,
    modalClosed: PropTypes.func,
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
          <div onClick={e => e.stopPropagation()}>
            {/* TODO pass in t */}
            {/* https://reactjs.org/docs/forms.html */}
            <form>
              <label>
                Location
              </label>
              <select>
                <option>Center</option>
                <option>Top Left</option>
                <option>Top Right</option>
                <option>Top Center</option>
                <option>Bottom Left</option>
                <option>Bottom Right</option>
                <option>Bottom Center</option>
              </select>
              <label>
                Text
              </label>
              <input type="text"/>

            </form>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <button>Reset</button>
            <button>Ok</button>
          </div>
        </div>
      </>
    );
  }
}