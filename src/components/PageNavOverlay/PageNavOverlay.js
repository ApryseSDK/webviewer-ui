import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import core from "core";
import classNames from 'classnames';
import selectors from "selectors";
import { isIOS } from "helpers/device";
import useMedia from 'hooks/useMedia';

import Icon from "components/Icon";
import DataElementWrapper from 'components/DataElementWrapper';

import "./PageNavOverlay.scss";

class PageNavOverlay extends React.PureComponent {
  static propTypes = {
    isLeftPanelDisabled: PropTypes.bool,
    isLeftPanelOpen: PropTypes.bool,
    isOpen: PropTypes.bool,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageLabels: PropTypes.array.isRequired,
    allowPageNavigation: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: '',
      isCustomPageLabels: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.pageLabels !== this.props.pageLabels) {
      const isCustomPageLabels = this.props.pageLabels.some(
        (label, index) => label !== `${index + 1}`
      );
      this.setState({ isCustomPageLabels });
    }

    if (
      prevProps.currentPage !== this.props.currentPage ||
      prevProps.pageLabels !== this.props.pageLabels
    ) {
      this.setState({
        input: this.props.pageLabels[this.props.currentPage - 1],
      });
    }
  }

  onClick = () => {
    if (isIOS) {
      setTimeout(() => {
        this.textInput.current.setSelectionRange(0, 9999);
      }, 0);
    } else {
      this.textInput.current.select();
    }
  };

  onChange = e => {
    if (!this.props.pageLabels?.some(p => p.startsWith(e.target.value))) {
      return;
    }

    this.setState({ input: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { input } = this.state;
    const isValidInput = input === "" || this.props.pageLabels.includes(input);

    if (isValidInput) {
      const pageToGo = this.props.pageLabels.indexOf(input) + 1;
      core.setCurrentPage(pageToGo);
    } else {
      this.textInput.current.blur();
    }
  };

  onBlur = () => {
    const { currentPage, pageLabels } = this.props;

    this.setState({ input: pageLabels[currentPage - 1] });
  };

  render() {
    const { currentPage, totalPages, allowPageNavigation, isMobile, t, dataElement } = this.props;

    const inputWidth = this.state.input ? (this.state.input.length) * (isMobile ? 10 : 8) : 0;

    return (
      <DataElementWrapper
        className={classNames({
          Overlay: true,
          PageNavOverlay: true,
        })}
        dataElement={dataElement || "pageNavOverlay"}
      >
        <button
          className="side-arrow-container"
          onClick={() => {
            if (window.docViewer.getCurrentPage() - 1 > 0) {
              window.docViewer.setCurrentPage(
                Math.max(window.docViewer.getCurrentPage() - 1, 1),
              );
            }
          }}
          aria-label={t('action.pagePrev')}
        >
          <Icon className="side-arrow" glyph="icon-chevron-left" />
        </button>
        <div className="formContainer" onClick={this.onClick}>
          <form onSubmit={this.onSubmit} onBlur={this.onBlur}>
            <input
              ref={this.textInput}
              type="text"
              value={this.state.input}
              onChange={this.onChange}
              tabIndex={-1}
              disabled={!allowPageNavigation}
              style={{ width: inputWidth }}
              aria-label={t('action.pageSet')}
            />
            {this.state.isCustomPageLabels
              ? ` (${currentPage}/${totalPages})`
              : ` / ${totalPages}`}
          </form>
        </div>
        <button
          className="side-arrow-container"
          onClick={() => {
            if (window.docViewer.getCurrentPage() + 1 <= window.docViewer.getPageCount()) {
              window.docViewer.setCurrentPage(
                Math.min(
                  window.docViewer.getCurrentPage() + 1,
                  window.docViewer.getPageCount(),
                ),
              );
            }
          }}
          aria-label={t('action.pageNext')}
        >
          <Icon className="side-arrow" glyph="icon-chevron-right" />
        </button>
      </DataElementWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  totalPages: selectors.getTotalPages(state),
  pageLabels: selectors.getPageLabels(state),
  allowPageNavigation: selectors.getAllowPageNavigation(state),
});

const ConnectedPageNavOverlay = connect(mapStateToProps)(withTranslation()(PageNavOverlay));

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedPageNavOverlay {...props} isMobile={isMobile} />
  );
};