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
import Button from 'components/Button';

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
    enableFadePageNavigation: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      input: '',
      isCustomPageLabels: false,
      isFocused: false,
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

    this.setState({ input: pageLabels[currentPage - 1], isFocused: false });
  };

  onFocus = () => {
    this.setState({ isFocused: true });
  }

  goToPrevPage = () => {
    if (window.documentViewer.getCurrentPage() - 1 > 0) {
      window.documentViewer.setCurrentPage(
        Math.max(window.documentViewer.getCurrentPage() - 1, 1),
      );
    }
  }

  goToNextPage = () => {
    if (window.documentViewer.getCurrentPage() + 1 <= window.documentViewer.getPageCount()) {
      window.documentViewer.setCurrentPage(
        Math.min(window.documentViewer.getCurrentPage() + 1, window.documentViewer.getPageCount())
      );
    }
  }

  render() {
    const {
      currentPage,
      totalPages,
      allowPageNavigation,
      isMobile,
      t,
      dataElement,
      enableFadePageNavigation
    } = this.props;

    const inputWidth = this.state.input ? (this.state.input.length) * (isMobile ? 10 : 8) : 0;

    return (
      <DataElementWrapper
        className={classNames({
          Overlay: true,
          PageNavOverlay: true,
          FadeOut: enableFadePageNavigation && !this.props.showNavOverlay && !this.state.isFocused
        })}
        dataElement={dataElement || "pageNavOverlay"}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <Button
          className="side-arrow-container"
          img="icon-chevron-left"
          title={t('action.pagePrev')}
          ariaLabel={t('action.pagePrev')}
          onClick={this.goToPrevPage}
          iconClassName="side-arrow"
          forceTooltipPosition="top"
          disabled={window.documentViewer.getCurrentPage() === 1}
        />
        <div className="formContainer" onClick={this.onClick}>
          <form onSubmit={this.onSubmit} onBlur={this.onBlur} onFocus={this.onFocus}>
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
        <Button
          className="side-arrow-container"
          img="icon-chevron-right"
          title={t('action.pageNext')}
          ariaLabel={t('action.pageNext')}
          onClick={this.goToNextPage}
          iconClassName="side-arrow"
          forceTooltipPosition="top"
          disabled={window.documentViewer.getCurrentPage() === window.documentViewer.getPageCount()}
        />
      </DataElementWrapper>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  totalPages: selectors.getTotalPages(state),
  pageLabels: selectors.getPageLabels(state),
  allowPageNavigation: selectors.getAllowPageNavigation(state),
  enableFadePageNavigation: selectors.shouldFadePageNavigationComponent(state),
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