import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { translate } from 'react-i18next';

import Icon from 'components/Icon';

import { isMac } from 'helpers/device';

import './Button.scss';

class Button extends React.PureComponent {
  static propTypes = {
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
    t: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  onClick = e => {
    ReactTooltip.hide();
    this.props.onClick(e);
  }

  getToolTip = () => {
    const { t, title } = this.props;

    if (title) {
      const toolTip = t(title) + ' ' + this.getShortcut();

      return toolTip;
    }

    return '';
  }

  getShortcut = () => {
    const { t, title } = this.props;
    // If shortcut.xxx exists in translation-en.json file 
    // method t will return the shortcut, otherwise it will return shortcut.xxx
    const tooltipHasShortcut = t(`shortcut.${title.split('.')[1]}`).indexOf('.') === -1;

    if (tooltipHasShortcut) {
      const shortcut = t(`shortcut.${title.split('.')[1]}`);

      return isMac ? shortcut.replace('Ctrl', 'Cmd') : shortcut;
    }

    return '';
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
       <div className={className} data-element={dataElement} data-tip={this.getToolTip()} onClick={this.onClick}>
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

export default translate(null, { wait: false } )(Button);