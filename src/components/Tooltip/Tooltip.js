import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { isMac, isIOS, isAndroid } from 'helpers/device';

import './Tooltip.scss';

class Tooltip extends React.PureComponent {
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
    isDisabled: PropTypes.bool,
    t: PropTypes.func.isRequired
  }

  static defaultProps = {
    location: 'bottom',
    delayShow: 700,
    content: '',
    isDisabled: false
  }

  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.showTimer = null;
    this.opacityTimeout = 50; // This is used for tooltip fade-in animation
    this.state = {
      show: false,
      style: {
        top: 0,
        left: 0,
        opacity: 0
      }
    };
  }

  componentDidMount() {
    if (!this.props.isDisabled) {
      this.addEventListeners(ReactDOM.findDOMNode(this));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.show && this.state.show) {
      this.setTopAndLeft(ReactDOM.findDOMNode(this));
      setTimeout(() => {
        this.setOpacity(1);
      }, this.opacityTimeout);
    }

    if (prevState.show && !this.state.show) {
      this.setOpacity(0);
    }

    if (prevProps.isDisabled && !this.props.isDisabled) {
      this.addEventListeners(ReactDOM.findDOMNode(this));
    }
  }

  addEventListeners = DOMElement => {
    try {
      DOMElement.addEventListener('mouseenter', this.show);
      DOMElement.addEventListener('mouseleave', this.hide);
      DOMElement.addEventListener('click', this.hide);
    } catch (e) {
      // we have this catch block here just to make sure UI doesn't blow up when DOMElement is null
      // although we haven't met this situation yet
      console.warn(`${this.props.children} is rendering null`);
    }
  }

  setTopAndLeft = DOMElement => {
    const { location } = this.props;
    const { top, bottom, left, right, width, height } = DOMElement.getBoundingClientRect();
    const locationTopLeftMap = {
      'bottom': {
        top: bottom,
        left: left + width / 2
      },
      'left': {
        top: top + height / 2,
        left
      },
      'right': {
        top: top + height / 2,
        left: right
      },
      'top': {
        top,
        left: left + width / 2
      }
    };

    const { top: tooltipTop, left: tooltipLeft } = locationTopLeftMap[location];
    this.setState({
      style: {
        ...this.state.style,
        top: tooltipTop,
        left: tooltipLeft
      }
    });
  }

  setOpacity = opacity => {
    this.setState({
      style: {
        ...this.state.style,
        opacity
      }
    });
  }

  show = () => {
    this.showTimer = setTimeout(() => {
      this.setState({ show: true });
    }, this.props.delayShow - this.opacityTimeout);
  }

  hide = () => {
    clearTimeout(this.showTimer);
    this.setState({ show: false });
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
          {`${content} `}
          {hasShortcut &&
            <span className="tooltip__shortcut">{this.renderShortcut()}</span>
          }
        </React.Fragment>
      );
    }

    return null;
  }

  renderShortcut = () => {
    const { t, content } = this.props;

    const shortcut = t(`shortcut.${content.split('.')[1]}`);

    return isMac ? shortcut.replace('Ctrl', 'Cmd') : shortcut;
  }

  renderChildren = () => {
    const { children, isDisabled } = this.props;
    const { type } = children;

    if (type === 'div') {
      // an example is the advanced button in the search overlay
      // we don't want to add isDisabled to a DOM element since it's not a valid HTML attribute
      return React.cloneElement(children);
    }
    if (typeof type === 'function') {
      // children is a React component such as <ActionButton />
      return React.cloneElement(children, { isDisabled });
    }

    return null;
  }

  render() {
    const { location, content } = this.props;
    const isUsingMobileDevices = isIOS || isAndroid;

    return (
      <React.Fragment>
        {this.renderChildren()}
        {
          this.state.show && content && !isUsingMobileDevices &&
          ReactDOM.createPortal(
            <div className={`tooltip--${location}`} style={this.state.style}>
              <div className={`tooltip__content`}>{this.renderContent()}</div>
            </div>,
            document.getElementById('app')
          )
        }
      </React.Fragment>
    );
  }
}

export default translate(null, { wait: false })(Tooltip);