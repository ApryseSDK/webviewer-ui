import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import './Button.scss';

class Button extends React.PureComponent {
  static propTypes = {
    willFocus: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool,
    mediaQueryClassName: PropTypes.string,
    img: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    title: PropTypes.string,
    color: PropTypes.string,
    dataElement: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    onTabOut: PropTypes.func,
  }

  containerRef = React.createRef();

  componentDidMount() {
    const {
      willFocus,
      onTabOut,
    } = this.props;
    if (willFocus) {
      this.focus();
    }
    if (onTabOut) {
      document.addEventListener('keydown', e => {
        if (e.key === 'Tab' || e.keyCode === 9) {
          if (!this.containerRef.current) {
            return;
          }
          if (document.activeElement === this.containerRef.current) {
            e.preventDefault();
            e.stopPropagation();
            onTabOut();
          }
        }
      });
    }
  }

  componentDidUpdate() {
    if (this.props.willFocus) {
      this.focus();
    }
  }

  focus() {
    if (this.containerRef.current) {
      this.containerRef.current.focus();
    }
  }

  onClick = e => {
    this.props.onClick(e);
  }

  onKeyPress = e => {
    if (e.nativeEvent.key === 'Enter' || e.nativeEvent.code === 'Space') {
      this.props.onClick(e);
    }
  }

  render() {
    const { isDisabled, isActive, mediaQueryClassName, img, label, color, dataElement } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = [
      'Button',
      this.props.className ? this.props.className : '',
      isActive ? 'active' : 'inactive',
      label ? 'label' : 'icon',
      mediaQueryClassName ? mediaQueryClassName : '',
    ].join(' ').trim();
    const isBase64 = img && img.trim().indexOf('data:') === 0;
    // if there is no file extension then assume that this is a glyph
    const isGlyph = img && (img.indexOf('.') === -1 || img.indexOf('<svg') === 0) && !isBase64;

    return (
      <div
        tabIndex={0}
        role="button"
        className={className}
        data-element={dataElement}
        onClick={this.onClick}
        onKeyPress={this.onKeyPress}
        ref={this.containerRef}
      >
        {isGlyph &&
          <Icon glyph={img} color={color} />
        }
        {img && !isGlyph &&
          <img src={img} />
        }
        {label &&
          <p>{label}</p>
        }
      </div>
    );
  }
}

export default Button;
