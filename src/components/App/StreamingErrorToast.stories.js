import React from 'react';
import StreamingErrorToast from './StreamingErrorToast';
import NetworkErrorWrapper from 'components/LazyLoadWrapper/NetworkErrorWrapper';

export default {
  title: 'Components/StreamingErrorToast',
  component: StreamingErrorToast,
};

export const Default = () => (
  <div className='ErrorToastContainer'>
    <StreamingErrorToast onDismiss={() => console.log('dismissed')} />
  </div>
);

export const BothToastsAtOnce = () => {
  const [showStreaming, setShowStreaming] = React.useState(true);
  const [showChunkLoad, setShowChunkLoad] = React.useState(true);

  return (
    <div style={{ height: '400px' }}>
      <p style={{ padding: '16px', color: 'var(--gray-7)' }}>
        Both error toasts visible at the same time. Each × should dismiss only its own toast.
      </p>

      <div className='ErrorToastContainer'>
        {showChunkLoad && (
          <div role='alert' className='ErrorToast'>
            <div className='ErrorToastContent'>
              <div>Failed to load &quot;notesPanel&quot;</div>
              <div>Please refresh the page to try again.</div>
            </div>
            <button
              type='button'
              className='ErrorToastClose'
              onClick={() => setShowChunkLoad(false)}
              aria-label='Close'
            >
              ×
            </button>
          </div>
        )}

        {showStreaming && (
          <StreamingErrorToast onDismiss={() => setShowStreaming(false)} />
        )}
      </div>
    </div>
  );
};
