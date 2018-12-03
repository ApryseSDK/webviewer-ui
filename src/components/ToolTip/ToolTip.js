import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { isMac } from 'helpers/device';

import './ToolTip.scss';

class ToolTip extends React.PureComponent {
  static propTypes = {
    location: PropTypes.oneOf([
      'top',
      'right',
      'bottom',
      'left'
    ]),
    delayShow: PropTypes.number,
    children: PropTypes.element,
    content: PropTypes.string,
    t: PropTypes.func.isRequired
  }

  static defaultProps = {
    location: 'bottom',
    delayShow: 650,
    content: ''
  }

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.showTimer = null;
    this.state = {
      show: false,
      style: {
        opacity: 0
      }
    };
  }

  componentDidUpdate(_, prevState) {
    if (!prevState.show && this.state.show) {
      setTimeout(() => {
        this.setOpacity(1);
      }, 50);
    }
    if (prevState.show && !this.state.show) {
      this.setOpacity(0);
    }
  }

  setOpacity = opacity => {
    this.setState({ style: { opacity } });
  }

  show = () => {
    this.showTimer = setTimeout(() => {
      this.setState({ show: true });
    }, this.props.delayShow);
  }

  hide = () => {
    clearTimeout(this.showTimer);
    this.setState({ show: false });
  }

  getShortcut = () => {
    const { t, content } = this.props;

    const shortcut = t(`shortcut.${content.split('.')[1]}`);

    return isMac ? shortcut.replace('Ctrl', 'Cmd') : shortcut;
  }

  renderContent = () => {
    const { t } = this.props;
    const content = t(this.props.content);

    if (content) {
      // If shortcut.xxx exists in translation-en.json file 
      // method t will return the shortcut, otherwise it will return shortcut.xxx
      const hasShortcut = t(`shortcut.${this.props.content.split('.')[1]}`).indexOf('.') === -1;

      return (
        <React.Fragment>
          {content}
          {hasShortcut &&
            <span className="shortcut">{this.getShortCut()}</span>
          }
        </React.Fragment>
      );
    }

    return null;
  }

  render() {
    const { location, children } = this.props;

    return (
      <div
        className="tooltip-wrapper"
        ref={this.wrapperRef}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
        onClick={this.hide}
      >
        {children}
        {
          this.state.show &&
          <div className={`tooltip--${location}`} style={this.state.style}>
            <div className={`tooltip__content`}>{this.renderContent()}</div>
          </div>
        }
      </div>
    );
  }
}

export default translate(null, { wait: false })(ToolTip);