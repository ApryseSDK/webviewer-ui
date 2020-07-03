import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import getToolStylePopupPositionBasedOn from 'helpers/getToolStylePopupPositionBasedOn';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
import defaultTool from 'constants/defaultTool';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import Button from 'components/Button';
import ActionButton from 'components/ActionButton';

import './StampOverlay.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const canvasWidth = 160;
const canvasHeight = 58;

let isFirstLoad = true;

class StampOverlay extends React.Component {
  static propTypes = {
    activeToolName: PropTypes.string,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    isActive: PropTypes.bool,
    t: PropTypes.func.isRequired,
    i18n: PropTypes.any,
    toolButtonObjects: PropTypes.object.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
    dataElement: PropTypes.string.isRequired,
    toggleElement: PropTypes.func.isRequired,
    isModalOpen: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      top: 0,
      standardAnnotations: [],
      customAnnotations: [],
      language: props.i18n.language,
      isStampSelected: false,
    };
    this.stampTool = core.getTool(TOOL_NAME);
  }
  componentDidMount() {
    this.stampTool.on('stampsUpdated', this.onStampAdded);
  }

  componentWillUnmount() {
    this.stampTool.off('stampsUpdated', this.onStampAdded);
  }

  onStampAdded = async() => {
    this.getStandardRubberStamps();
    this.getCustomRubberStamps();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'menuOverlay',
        'toolsOverlay',
        'zoomOverlay',
        'toolStylePopup',
      ]);
      this.setOverlayPosition();
      if (isFirstLoad) {
        this.onStampAdded();
        isFirstLoad = false;
      }
    }


    // if language changes while overlay is open we wanted update it
    // for some reason we cannot use prevPros.i18n.language to check
    // if language changed.
    const isLanChanged = this.props.i18n.language !== this.state.language;
    if (isLanChanged) {
      this.setState({ language: this.props.i18n.language });
      this.onStampAdded();
    }
  }

  handleClickOutside = e => {
    if (this.props.isModalOpen) {
      return;
    }
    const toolStylePopup = document.querySelector('[data-element="toolStylePopup"]');
    const toolsOverlay = document.querySelector('[data-element="toolsOverlay"]');
    const isToolsOverlay = toolsOverlay?.contains(e.target);
    const header = document.querySelector('[data-element="header"]');
    const clickedToolStylePopup = toolStylePopup?.contains(e.target);
    const clickedHeader = header?.contains(e.target);
    const rubberStampToolButton = e.target.getAttribute('data-element') === this.props.dataElement;

    if (this.props.isActive) {
      this.props.toggleElement('stampOverlay');
    }

    if (this.props.isOpen && !rubberStampToolButton) {
      this.props.closeElement('stampOverlay');

      if (this.props.activeToolName === TOOL_NAME &&
          !clickedToolStylePopup &&
          !clickedHeader &&
          !isToolsOverlay &&
          !this.state.isStampSelected) {
        core.setToolMode(defaultTool);
      }
    }
  }

  setOverlayPosition = () => {
    const rubberStampToolButton = document.querySelector(
      `[data-element="${this.props.dataElement}"]`,
    );

    if (rubberStampToolButton && this.overlay.current) {
      const res = getToolStylePopupPositionBasedOn(rubberStampToolButton, this.overlay);
      this.setState(res);
    }
  }

  setRubberStamp(annotation) {
    core.setToolMode(TOOL_NAME);
    this.props.closeElement('stampOverlay');
    const text = this.props.t(`rubberStamp.${annotation['Icon']}`);
    this.stampTool.setRubberStamp(annotation, text);
    this.stampTool.showPreview();

    this.setState({ isStampSelected: true });
  }


  getCustomRubberStamps = async() => {
    let annotations = [];
    try {
      annotations = await this.stampTool.getCustomStampAnnotations();
    } catch (error) {
      console.error(error);
    }
    await Promise.all(
      annotations.map(annotation => {
        const text = this.props.t(`rubberStamp.${annotation['Icon']}`);

        const options = {
          canvasWidth,
          canvasHeight,
          text,
        };

        return this.stampTool.getPreview(annotation, options);
      }),
    );

    const customAnnotations = annotations.map(annotation => ({
      annotation,
      imgSrc: annotation['ImageData'],
    }));

    this.setState({ customAnnotations });
  }

  getStandardRubberStamps = async() => {
    let annotations = [];
    try {
      annotations = await this.stampTool.getStandardStampAnnotations();
    } catch (error) {
      console.error(error);
    }

    const previews = await Promise.all(
      annotations.map(annotation => {
        const text = this.props.t(`rubberStamp.${annotation['Icon']}`);

        const options = {
          canvasWidth,
          canvasHeight,
          text,
        };

        return this.stampTool.getPreview(annotation, options);
      }),
    );

    const standardAnnotations = annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));

    this.setState({ standardAnnotations, language: this.props.i18n.language });
  }
  openCustomSampModal = () => {
    const { openElement } = this.props;
    openElement('customStampModal');
  }

  deleteCustomStamp = index => {
    const stamps = this.stampTool.getCustomStamps();
    stamps.splice(index, 1);
    this.stampTool.setCustomStamps(stamps);
  }

  render() {
    const { left, top, standardAnnotations, customAnnotations } = this.state;
    const { isDisabled, isOpen } = this.props;
    if (isDisabled) {
      return null;
    }

    const StandardLabel =  this.props.t(`tool.Standard`);
    const CustomLabel = this.props.t(`tool.Custom`);
    const ButtonLabel = this.props.t(`component.createStampButton`);

    let imgs = null;
    let customStamps = null;
    if (isOpen) {
      imgs = standardAnnotations.map(({ imgSrc, annotation }, index) =>
        <div key={index}
          className="rubber-stamp"
          onClick={() => this.setRubberStamp(annotation)}
        >
          <img src={imgSrc} />
        </div>,
      );

      customStamps = customAnnotations.map(({ imgSrc, annotation }, index) =>
        <div key={index}  className="stamp-row">
          <div className="stamp-row-content" onClick={() => this.setRubberStamp(annotation, standardAnnotations.length + index)}>
            <img src={imgSrc} alt=""/>
          </div>
          <ActionButton
            dataElement="customStampDeleteBtn"
            img="ic_delete_black_24px"
            onClick={() => this.deleteCustomStamp(index)}
          />
        </div>,
      );
    }
    const className = classNames({
      'Overlay': true,
      'StampOverlay': true,
      'open': isOpen,
      'closed': !isOpen,
    });

    return (
      <div
        className={className}
        ref={this.overlay}
        style={{ left, top }}
        data-element="stampOverlay"
      >
        <Tabs id="rubberStampTab">
          <div className="header">
            <div className="tab-list">
              <Tab dataElement="standardStampPanelButton">
                <Button label={StandardLabel} />
              </Tab>
              <Tab dataElement="customStampPanelButton">
                <Button label={CustomLabel} />
              </Tab>
            </div>
          </div>

          <TabPanel dataElement="standardStampPanel">
            <div className="standard-stamp-panel">
              { imgs }
            </div>
          </TabPanel>
          <TabPanel dataElement="customStampPanel">
            <div className="custom-stamp-panel">
              { customStamps }
            </div>
            <div className={`add-custom-stamp-button enabled`}
              onClick={this.openCustomSampModal}
              data-element={'add-custom-stamp-button'}
            >
              {ButtonLabel}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'stampOverlay'),
  isOpen: selectors.isElementOpen(state, 'stampOverlay'),
  isModalOpen: selectors.isElementOpen(state, 'customStampModal'),
  activeToolName: selectors.getActiveToolName(state),
  isActive: selectors.getActiveToolName(state) === TOOL_NAME,
  toolButtonObjects: selectors.getToolButtonObjects(state),
  dataElement: selectors.getToolButtonObjects(state)[TOOL_NAME].dataElement,
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  toggleElement: actions.toggleElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(onClickOutside(StampOverlay)));
