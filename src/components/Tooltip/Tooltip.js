import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { isMac, isIOS, isAndroid } from 'helpers/device';

import './Tooltip.scss';

class Tooltip extends React.PureComponent {
  static propTypes = {
    delayShow: PropTypes.number,
    children: PropTypes.element,
    content: PropTypes.string,
    t: PropTypes.func.isRequired
  }

  static defaultProps = {
    delayShow: 700,
    content: '',
  }

  constructor(props) {
    super(props);
    this.showTimer = null;
    // used for tooltip fade-in animation
    this.opacityTimeout = 50;
    this.childRef = React.createRef();
    this.tooltipRef = React.createRef();
    this.state = {
      show: false,
      style: {
        top: 0,
        left: 0,
        opacity: 0
      },
      location: 'bottom'
    };
  }

  componentDidMount() {
    if (this.childRef.current) {
      this.childRef.current.addEventListener('mouseenter', this.show);
      this.childRef.current.addEventListener('mouseleave', this.hide);
      this.childRef.current.addEventListener('click', this.hide);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.show && this.state.show && this.childRef.current) {
      this.setTopAndLeft(this.childRef.current, this.tooltipRef.current);
      setTimeout(() => {
        this.setOpacity(1);
      }, this.opacityTimeout);
    }

    if (prevState.show && !this.state.show) {
      this.setOpacity(0);
    }
  }

  setTopAndLeft = (childEle, tooltipEle) => {
    const childRect = childEle.getBoundingClientRect();
    const tooltipRect = tooltipEle.getBoundingClientRect();

    const locationTopLeftMap = {
      'bottom': {
        top: childRect.bottom,
        left: childRect.left + childRect.width / 2 - tooltipRect.width / 2
      },
      'left': {
        top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
        left: childRect.left - tooltipRect.width
      },
      'right': {
        top: childRect.top + childRect.height / 2 - tooltipRect.height / 2,
        left: childRect.right
      },
      'top': {
        top: childRect.top - tooltipRect.height,
        left: childRect.left + childRect.width / 2 - tooltipRect.width / 2
      }
    };

    const bestLocation = Object.keys(locationTopLeftMap).find(location => {
      const { top: newTop, left: newLeft } = locationTopLeftMap[location];

      return newTop > 0 && newTop + tooltipRect.height < window.innerHeight && newLeft > 0 && newLeft + tooltipRect.width < window.innerWidth;
    });

    const { top: tooltipTop, left: tooltipLeft } = locationTopLeftMap[bestLocation];

    this.setState({
      style: {
        ...this.state.style,
        top: tooltipTop,
        left: tooltipLeft
      },
      location: bestLocation
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

  render() {
    const isUsingMobileDevices = isIOS || isAndroid;
    const { content } = this.props;

    const childrenCount = React.Children.count(this.props.children);
    if (childrenCount !== 1) {
      console.warn(`<Tooltip> only accept one child, ${childrenCount} children are passed to it`);
    }

    const child = React.cloneElement(
      this.props.children, 
      {
        ref: this.childRef
      }
    );

    return (
      <React.Fragment>
        {child}
        {
          this.state.show && content && !isUsingMobileDevices &&
          ReactDOM.createPortal(
            <div className={`tooltip--${this.state.location}`} style={this.state.style} ref={this.tooltipRef}>
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