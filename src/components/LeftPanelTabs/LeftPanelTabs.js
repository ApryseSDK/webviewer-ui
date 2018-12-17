import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Button from 'components/Button';
import Element from 'components/Element';
import Tooltip from 'components/Tooltip';

import actions from 'actions';
import selectors from 'selectors';

import './LeftPanelTabs.scss';

class LeftPanelTabs extends React.Component {
  static propTypes = {
    activePanel: PropTypes.string.isRequired,
    disabledCustomPanelTabs: PropTypes.array.isRequired,
    customPanels: PropTypes.array.isRequired,
    isLeftPanelTabsDisabled: PropTypes.bool,
    isThumbnailsPanelButtonDisabled: PropTypes.bool,
    isOutlinesPanelButtonDisabled: PropTypes.bool,
    isNotesPanelButtonDisabled: PropTypes.bool,
    setActiveLeftPanel: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  }

  isActive = panel => {
    return this.props.activePanel === panel;
  }

  render() {
    const {
      customPanels,
      isLeftPanelTabsDisabled,
      isThumbnailsPanelButtonDisabled,
      isOutlinesPanelButtonDisabled,
      isNotesPanelButtonDisabled,
      setActiveLeftPanel,
      disabledCustomPanelTabs
    } = this.props;

    if (isLeftPanelTabsDisabled) {
      return null;
    }

    return (
      <Element className="LeftPanelTabs" dataElement="leftPanelTabs">
        <Tooltip content="component.thumbnailsPanel" isDisabled={isThumbnailsPanelButtonDisabled}>
          <Button
            isActive={this.isActive('thumbnailsPanel')}
            dataElement="thumbnailsPanelButton"
            img="ic_thumbnails_black_24px"
            onClick={() => setActiveLeftPanel('thumbnailsPanel')}
          />
        </Tooltip>
        <Tooltip content="component.outlinesPanel" isDisabled={isOutlinesPanelButtonDisabled}>
          <Button
            isActive={this.isActive('outlinesPanel')}
            dataElement="outlinesPanelButton"
            img="ic_outline_black_24px"
            onClick={() => setActiveLeftPanel('outlinesPanel')}
          />
        </Tooltip>
        <Tooltip content="component.notesPanel" isDisabled={isNotesPanelButtonDisabled}>
          <Button
            isActive={this.isActive('notesPanel')}
            dataElement="notesPanelButton"
            img="ic_annotations_black_24px"
            onClick={() => setActiveLeftPanel('notesPanel')}
          />
        </Tooltip>
        {customPanels.map(({ panel, tab }, index) => (
          <Tooltip key={tab.dataElement || index} content={tab.title} isDisabled={disabledCustomPanelTabs.includes(tab.dataElement)}>
            <Button
              isActive={this.isActive(panel.dataElement)}
              dataElement={tab.dataElement}
              img={tab.img}
              onClick={() => setActiveLeftPanel(panel.dataElement)}
            />
          </Tooltip>
        ))}
      </Element>
    );
  }
}

const mapStateToProps = state => ({
  activePanel: selectors.getActiveLeftPanel(state),
  customPanels: selectors.getCustomPanels(state),
  disabledCustomPanelTabs: selectors.getDisabledCustomPanelTabs(state),
  isLeftPanelTabsDisabled: selectors.isElementDisabled(state, 'leftPanelTabs'),
  isThumbnailsPanelButtonDisabled: selectors.isElementDisabled(state, 'thumbnailsPanelButton'),
  isOutlinesPanelButtonDisabled: selectors.isElementDisabled(state, 'outlinesPanelButton'),
  isNotesPanelButtonDisabled: selectors.isElementDisabled(state, 'notesPanelButton')
});

const mapDispatchToProps = {
  setActiveLeftPanel: actions.setActiveLeftPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(LeftPanelTabs));