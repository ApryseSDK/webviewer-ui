import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Outline from 'components/Outline';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './OutlinesPanel.scss';

class OutlinesPanel extends React.PureComponent {
  static propTypes = {
    outlines: PropTypes.arrayOf(PropTypes.object),
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    t: PropTypes.func.isRequired
  }

  render() {
    const { isDisabled, outlines, t, display } = this.props;
    
    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel OutlinesPanel', this.props);

    return (
      <div className={className} style={{ display }} data-element="outlinesPanel">
        {outlines.length === 0 &&
          <div className="no-outlines">{t('message.noOutlines')}</div>
        }
        {outlines.map((outline, i) => (
          <Outline key={i} outline={outline} isVisible />
        ))}
      </div>
    );
    
  }
}

const mapStateToProps = state => ({
  outlines: selectors.getOutlines(state),
  isDisabled: selectors.isElementDisabled(state, 'outlinePanel'),
  isOpen: selectors.isElementOpen(state, 'outlinePanel'),
});

export default connect(mapStateToProps)(translate()(OutlinesPanel));