import { createRefHandler } from './CommentTextareaHelper';

describe('CommentTextarea', () => {
  describe('ref handler', () => {
    it('should set aria label and call external ref handler when editor exists', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: true,
        t,
        externalRefHandler,
      });

      const root = {};
      const getEditor = jest.fn(() => ({ root }));
      const element = {
        editor: {},
        getEditor,
      };

      handleRef(element);

      expect(root.ariaLabel).toBe('action.reply');
      expect(externalRefHandler).toHaveBeenCalledWith(element);
    });

    it('should not throw error when element is not defined', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: false,
        t,
        externalRefHandler,
      });

      expect(() => handleRef(undefined)).not.toThrow();
      expect(externalRefHandler).toHaveBeenCalledWith(undefined);
    });

    it('should not attempt to access editor when element exists but editor is undefined', () => {
      const t = (key) => key;
      const externalRefHandler = jest.fn();
      const handleRef = createRefHandler({
        isReply: false,
        t,
        externalRefHandler,
      });

      const getEditor = jest.fn();
      const element = {
        editor: undefined,
        getEditor,
      };

      expect(() => handleRef(element)).not.toThrow();
      expect(getEditor).not.toHaveBeenCalled();
      expect(externalRefHandler).toHaveBeenCalledWith(element);
    });
  });
});