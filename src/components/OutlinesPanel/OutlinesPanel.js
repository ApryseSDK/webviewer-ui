import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Outline from 'components/Outline';
import Icon from 'components/Icon';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './OutlinesPanel.scss';

class OutlinesPanel extends React.PureComponent {
  static propTypes = {
    outlines: PropTypes.arrayOf(PropTypes.object),
    isDisabled: PropTypes.bool,
    t: PropTypes.func.isRequired,
  }

  render() {
    const { isDisabled, outlines, t } = this.props;

    if (isDisabled) {
      return null;
    }

    const className = getClassName('Panel OutlinesPanel', this.props);

    return (
      <div className={className} data-element="outlinesPanel">
        {outlines.length === 0 &&
          <div className="no-outlines">
            <div>
              <Icon
                className="empty-icon"
                glyph="illustration - empty state - outlines"
              />
            </div>
            <div className="msg">
              {t('message.noOutlines')}
            </div>
          </div>
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
});

export default connect(mapStateToProps)(withTranslation()(OutlinesPanel));