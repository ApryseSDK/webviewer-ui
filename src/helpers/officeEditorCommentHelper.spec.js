import { OFFICE_EDITOR_COMMENT_KEY } from 'constants/officeEditor';
import { deleteOfficeEditorComment, updateOfficeEditorCommentMessage } from './officeEditorCommentHelper';

describe('officeEditorCommentHelper', () => {
  let warnSpy;

  afterEach(() => {
    if (warnSpy) {
      warnSpy.mockRestore();
      warnSpy = null;
    }
  });

  describe('updateOfficeEditorCommentMessage', () => {
    it('Should call setCommentMessage with a numeric id and message', async () => {
      const setCommentMessage = jest.fn(() => Promise.resolve());
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            setCommentMessage,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => '42'),
      };

      const didUpdate = await updateOfficeEditorCommentMessage({
        annotation,
        text: 'Edited comment',
        core: coreMock,
      });

      expect(annotation.getCustomData).toHaveBeenCalledWith(OFFICE_EDITOR_COMMENT_KEY);
      expect(setCommentMessage).toHaveBeenCalledWith(42, 'Edited comment');
      expect(didUpdate).toBe(true);
    });

    it('Should warn when updating an office editor comment fails', async () => {
      const error = new Error('Update failed');
      const setCommentMessage = jest.fn(() => Promise.reject(error));
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            setCommentMessage,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => '42'),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const didUpdate = await updateOfficeEditorCommentMessage({
        annotation,
        text: 'Edited comment',
        core: coreMock,
      });

      expect(warnSpy).toHaveBeenCalled();
      expect(didUpdate).toBe(false);
    });

    it('Should warn and return false for invalid comment ids', async () => {
      const setCommentMessage = jest.fn();
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            setCommentMessage,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => 'not-a-number'),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const didUpdate = await updateOfficeEditorCommentMessage({
        annotation,
        text: 'Edited comment',
        core: coreMock,
      });

      expect(annotation.getCustomData).toHaveBeenCalledWith(OFFICE_EDITOR_COMMENT_KEY);
      expect(setCommentMessage).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      expect(didUpdate).toBe(false);
    });

    it('Should warn and return false when annotation is missing', async () => {
      const setCommentMessage = jest.fn();
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            setCommentMessage,
          }),
        }),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const didUpdate = await updateOfficeEditorCommentMessage({
        annotation: null,
        text: 'Edited comment',
        core: coreMock,
      });

      expect(setCommentMessage).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      expect(didUpdate).toBe(false);
    });
  });

  describe('deleteOfficeEditorComment', () => {
    it('Should call deleteComment with a numeric id', async () => {
      const deleteComment = jest.fn(() => Promise.resolve());
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            deleteComment,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => '24'),
      };

      await deleteOfficeEditorComment({
        annotation,
        core: coreMock,
      });

      expect(annotation.getCustomData).toHaveBeenCalledWith(OFFICE_EDITOR_COMMENT_KEY);
      expect(deleteComment).toHaveBeenCalledWith(24);
    });

    it('Should warn when deleting an office editor comment fails', async () => {
      const error = new Error('Delete failed');
      const deleteComment = jest.fn(() => Promise.reject(error));
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            deleteComment,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => '24'),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await deleteOfficeEditorComment({
        annotation,
        core: coreMock,
      });

      expect(warnSpy).toHaveBeenCalled();
    });

    it('Should warn and return false for invalid comment ids', async () => {
      const deleteComment = jest.fn();
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            deleteComment,
          }),
        }),
      };
      const annotation = {
        getCustomData: jest.fn(() => 'bad-id'),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await deleteOfficeEditorComment({
        annotation,
        core: coreMock,
      });

      expect(annotation.getCustomData).toHaveBeenCalledWith(OFFICE_EDITOR_COMMENT_KEY);
      expect(deleteComment).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('Should warn and return false when annotation is missing', async () => {
      const deleteComment = jest.fn();
      const coreMock = {
        getOfficeEditor: () => ({
          getCommentManager: () => ({
            deleteComment,
          }),
        }),
      };
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await deleteOfficeEditorComment({
        annotation: null,
        core: coreMock,
      });

      expect(deleteComment).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});
