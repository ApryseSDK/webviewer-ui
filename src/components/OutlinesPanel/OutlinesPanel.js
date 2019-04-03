import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Outline from 'components/Outline';

import getClassName from 'helpers/getClassName';
import selectors from 'selectors';
import actions from 'actions';

import mod from 'helpers/modulus';

import './OutlinesPanel.scss';

class OutlinesPanel extends React.PureComponent {
  static propTypes = {
    selectionIndex: PropTypes.number,
    outlines: PropTypes.arrayOf(PropTypes.object),
    display: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    t: PropTypes.func.isRequired,
    setLeftPanelIndex: PropTypes.func.isRequired
  }

  componentDidUpdate(prevProps) {
    const {
      display,
      setLeftPanelIndex,
    } = this.props;
    const isHiding = display === 'none' && prevProps.display !== 'none';
    if (isHiding) {
      // nuke selection index
      setLeftPanelIndex('outlinesPanel', null);
    }
  }

  render() {
    const { isDisabled, outlines, t, display, selectionIndex } = this.props;

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
          <Outline
            key={i}
            index={i}
            outline={outline}
            isVisible
            willFocus={selectionIndex !== null && mod(selectionIndex, outlines.length) === i}
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  outlines: selectors.getOutlines(state),
  isDisabled: selectors.isElementDisabled(state, 'outlinesPanel'),
  selectionIndex: selectors.getLeftPanelIndex(state, 'outlinesPanel'),
});

export default connect(mapStateToProps, { setLeftPanelIndex: actions.setLeftPanelIndex })(translate()(OutlinesPanel));
