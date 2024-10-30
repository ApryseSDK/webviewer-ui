import React,
{
  useEffect,
  useState
} from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import './IndexPanel.scss';
import core from 'core';
import DataElements from 'constants/dataElement';
import IndexPanel from './IndexPanel';
import PropTypes from 'prop-types';
import selectors from 'selectors';

const propTypes = {
  parentDataElement: PropTypes.string,
  dataElement: PropTypes.string.isRequired,
};

function IndexPanelContainer(props) {
  const { parentDataElement = undefined, dataElement } = props;
  const [
    isOpen,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, parentDataElement || dataElement || DataElements.INDEX_PANEL),
    ],
    shallowEqual,
  );
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const annotationChangedListener = () => {
      const defaultWidgets = core.getAnnotationsList().filter((annot) => annot instanceof window.Core.Annotations.WidgetAnnotation);
      setWidgets(defaultWidgets);
    };

    core.addEventListener('annotationChanged', annotationChangedListener);
    return () => {
      core.removeEventListener('annotationChanged', annotationChangedListener);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const defaultWidgets = core.getAnnotationsList().filter((annot) => annot instanceof window.Core.Annotations.WidgetAnnotation);
      setWidgets(defaultWidgets);
    } else {
      setWidgets([]);
    }
  }, [isOpen]);

  const passProps = {
    widgets,
  };

  return (
    <IndexPanel {...props} {...passProps} />
  );
}

IndexPanelContainer.propTypes = propTypes;

export default IndexPanelContainer;
