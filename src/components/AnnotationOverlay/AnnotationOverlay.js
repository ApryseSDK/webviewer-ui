import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';

import core from 'core';
import getClassName from 'helpers/getClassName';

import './AnnotationOverlay.scss';

const MAX_WORDS = 100;

const AnnotationOverlay = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [annotation, setAnnotation] = useState();
  const [repliesCount, setRepliesCount] = useState(0);
  const [overlayPosition, setOverlayPosition] = useState();

  const am = core.getAnnotationManager();

  useEffect(() => {
    window.docViewer.on('mouseMove.hover', onMouseHover);
  });

  const onMouseHover = (e, mouseEvent) => {
    const annotation = am.getAnnotationByMouseEvent(mouseEvent);
    console.log(annotation);
    if (!!annotation !== isOpen) {
      setIsOpen(!isOpen)
    }
    // if (annotation) {
    //   setAnnotation(annotation);
    //   setOverlayPosition({
    //     left: mouseEvent.clientX + 20,
    //     top:mouseEvent.clientY + 20
    //   });
    //   setRepliesCount(annotation.getReplies().length);
    // }
  }

  // if (annotation && annotation.getContents()) {
    return (
      <div>
        {/* {`${isOpen} is Open`} */}
      </div>
    );
  // } else {
  //   return null;
  // }
}

// class implementation
// class AnnotationOverlay extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = { 'isOpen': false }
//   }

//   componentDidMount() {
//     window.docViewer.on('mouseMove.hover', this.onMouseHover);
//   }

//   onMouseHover = (e, mouseEvent) => {
//     const am = core.getAnnotationManager();
//     const annotation = am.getAnnotationByMouseEvent(mouseEvent);
//     if (!!annotation !== this.state.isOpen) {
//       this.setState({ isOpen: !this.state.isOpen })
//     }
//     if (annotation) {
//       this.setState({
//         annotation,
//         left: mouseEvent.clientX + 20,
//         top: mouseEvent.clientY + 20,
//         repliesCount: annotation.getReplies().length
//       });
//     }
//   }

//   render() {
//     const { annotation, left, top, repliesCount } = this.state;
//     if (annotation) {
//       let contents = annotation.getContents();
//       if (contents && contents.length > MAX_WORDS) {
//         // if string is longer than MAX_WORDS, show the first 100 characters
//         contents = contents.slice(0, MAX_WORDS);
//         contents += '...';
//       }
//       // make sure annotation contains annotation and contents
//       const isOpen = this.state.isOpen && annotation && contents;
//       return <div 
//         className={getClassName("Overlay AnnotationOverlay", { isOpen })}
//         data-element="annotationOverlay"
//         style={{ left, top }}
//       >
//         <div className="author">
//           {annotation.Author}
//         </div>
//           {contents}
//         <div>
//           {repliesCount > 0 && `Replies (${repliesCount})`}
//         </div>
//       </div>
//     } else {
//       return null;
//     }
//   }
// }

export default (withTranslation()(AnnotationOverlay));