import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Outline from 'components/Outline';
import ListWithKeyboard from 'components/ListWithKeyboard';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';

import './OutlinesPanel.scss';

class OutlinesPanel extends React.PureComponent {
  static propTypes = {
    outlines: PropTypes.arrayOf(PropTypes.object),
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    t: PropTypes.func.isRequired
  }

  renderOutline = (outline, index, refSetter) => {
    return (
      <Outline
        ref={refSetter}
        outline={outline}
        isVisible
      />
    );
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
        <ListWithKeyboard
          data={outlines}
          renderItem={this.renderOutline}
        />
      </div>
    );

  }
}

const mapStateToProps = state => ({
  outlines: selectors.getOutlines(state),
  isDisabled: selectors.isElementDisabled(state, 'outlinePanel')
});

export default connect(mapStateToProps)(translate()(OutlinesPanel));
