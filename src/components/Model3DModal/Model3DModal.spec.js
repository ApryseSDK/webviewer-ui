import React from 'react';
import { render } from '@testing-library/react';
import Model3DModal from './Model3DModal';
import { Basic } from './Model3DModal.stories';

// wrap story component with i18n provider, so component can use useTranslation()
const BasicModel3DModalStory = withI18n(Basic);
// wrap base component with i81n provider and mock redux
const TestModel3DModal = withProviders(Model3DModal);



describe('Model3DModal', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicModel3DModalStory />);
    }).not.toThrow();
  });

  it('Should not render component if disabled', () => {
    // render component with isDisabled=true which should cause component to not render anything
    const { container } = render(
      <TestModel3DModal
        isDisabled={true}
      />
    );
    // Verify that .Model3DModal div is not in the document
    expect(container.querySelector('.Model3DModal')).not.toBeInTheDocument();
  });

  it('Should render component if it is opened', () => {
    const { container } = render(
      <BasicModel3DModalStory
        isOpen={true}
      />
    );
    // Verify that .Model3DModal div is in the document
    expect(container.querySelector('.Model3DModal')).toBeInTheDocument();
  });
});
