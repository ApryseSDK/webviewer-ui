import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import core from 'core';
import getClassName from 'helpers/getClassName';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import ActionButton from 'components/ActionButton';


import './StampModal.scss';


const typeEnum = {
  'Approved': 'Approved',
  'AsIs': 'As Is',
  'Completed': 'Completed',
  'Confidential': 'Confidential',
  'Departmental': 'Departmental',
  'Draft': 'Draft',
  'Experimental': 'Experimental',
  'Expired': 'Expired',
  'Final': 'Final',
  'ForComment': 'For Comment',
  'ForPublicRelease': 'For Public Release',
  'InformationOnly': 'Information Only',
  'NotApproved': 'Not Approved',
  'NotForPublicRelease': 'Not For Public Release',
  'PreliminaryResults': 'Preliminary Results',
  'Sold': 'Sold',
  'TopSecret': 'Top Secret',
  'Void': 'Void',
};


class StampModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultRubberStamps: [],
    };
    this.stampTool = core.getTool('AnnotationCreateRubberStamp');
  }

  closeModal = () => {
    this.props.closeElement('stampModal');
    // core.setToolMode(defaultTool);
  }

  createDefaultRubberStamps() {

  }

  setRubberStamp(stampName, stampText) {
    var _canvas = document.createElement('canvas');
    var _ctx = _canvas.getContext('2d');
    _ctx.font = 'italic 30px Verdana';

    var getHeight = 38;
    var width = _ctx.measureText(stampText).width;

    const annotation = new Annotations.StampAnnotation();
    annotation.Width = width;
    annotation.Height = getHeight;
    annotation.Icon = stampName;
    annotation.MaintainAspectRatio = true;


    core.setToolMode('AnnotationCreateRubberStamp');
    this.stampTool.setRubberStamp(annotation);
    this.stampTool.showPreview();
  }

  render() {
    var me = this;
    const { isOpen } = this.props;
    const { defaultRubberStamps } = this.state;
    const className = getClassName('Modal StampModal', this.props);
    // console.log(this.props);
    var canvases = null;
    if (isOpen) {
      canvases = Object.keys(typeEnum).map((key, index) => {
        const style = {
          // border: '1px solid #d3d3d3',
        };
        return (
          <Canvas
            code={key}
            text={typeEnum[key]}
            key={index}
            width="160"
            height="48"
            style={style}
            stampTool={this.stampTool}
            onClick={() => this.setRubberStamp(key, typeEnum[key])}
          />
        );
      });
    }
    return (
      <div
        className={className}
        data-element="stampModal"
        onClick={this.closeModal}
      >
        <div className="container">
          <ActionButton
            dataElement="signatureModalCloseButton"
            title="action.close"
            img="ic_close_black_24px"
            onClick={this.closeModal}
          />
          {
            defaultRubberStamps.map(({ imgSrc }, index) => (
              <div className="" key={index}>
                <img src={imgSrc} />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

class Canvas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const canvas = this.canvas;
    var _canvas = document.createElement('canvas');
    var _ctx = _canvas.getContext('2d');
    _ctx.font = 'bold italic 30px Verdana';
    var stampText = this.props.text;
    var X = 5;
    var Y = 5;
    var opacity = 1;
    var getWidth = this.props.width - 10;
    var getHeight = this.props.height - 10;

    var width = _ctx.measureText(stampText).width;
    var w = getWidth;
    if (width < getWidth) {
      w = width;
    }

    const ctx = canvas.getContext('2d');

    const stampAnnot = new Annotations.StampAnnotation();
    stampAnnot.PageNumber = 1;
    stampAnnot.X = X;
    stampAnnot.Y = Y;
    stampAnnot.Width = w;
    stampAnnot.Height = getHeight;
    stampAnnot.Opacity = opacity;
    stampAnnot.Icon = this.props.code;
    stampAnnot.MaintainAspectRatio = true;
    this.props.stampTool.getPreview(stampAnnot, ctx);
  }

  render() {
    const { width, height, style } = this.props;

    return (
      <canvas ref={ref => { this.canvas = ref; }}
        style={style}
        width={width}
        height={height}
        onClick={this.props.onClick}
      />
    );
  }
}

const mapStateToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'stampModal'),
});

const mapDispatchToProps = {
  closeElement: actions.closeElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(StampModal));