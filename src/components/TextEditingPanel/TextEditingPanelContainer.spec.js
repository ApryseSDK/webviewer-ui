import handleSelectionChange from './TextEditingPanelHelpers/handleSelectionChange';
import getFontInfo from './TextEditingPanelHelpers/getFontInfo';


// eslint-disable-next-line custom/no-hex-colors
const testColorHex = '#FF0000';

describe('handleSelectionChange', () => {
  let mockContentEditorRef;
  let mockInstance;
  let mockSetSelectionMode;
  let mockSetFonts;
  let mockSetTextEditProperties;
  let mockSetFormat;
  let mockHandleColorChange;
  let mockGetFontName;

  beforeEach(() => {
    mockSetSelectionMode = jest.fn();
    mockSetFonts = jest.fn();
    mockSetTextEditProperties = jest.fn();
    mockSetFormat = jest.fn();
    mockHandleColorChange = jest.fn();
    mockGetFontName = jest.fn((fontName) => fontName.replace(/(Bold|Italic)/gi, '').trim());

    mockContentEditorRef = {
      current: {
        getTextAttributes: jest.fn().mockResolvedValue({
          fontColor: testColorHex,
          fontSize: 12,
          fontName: 'Arial',
          textAlign: 'left',
          bold: false,
          italic: false,
          underline: false,
        }),
      },
    };

    mockInstance = {
      Core: {
        Annotations: {
          Color: jest.fn((color) => ({ toHexString: () => color })),
        },
        ContentEdit: {
          Types: {
            TEXT: 'text',
            OBJECT: 'object',
          },
          setTextAttributes: jest.fn(),
        },
      },
    };
  });

  it('should call setSelectionMode with TEXT type when in content edit mode', async () => {
    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetSelectionMode).toHaveBeenCalledWith('text');
  });

  it('should not call setSelectionMode when not in content edit mode', async () => {
    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: false,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetSelectionMode).not.toHaveBeenCalled();
  });

  it('should set text properties and format before calling setSelectionMode', async () => {
    const callOrder = [];
    mockSetTextEditProperties.mockImplementation(() => callOrder.push('setTextEditProperties'));
    mockSetFormat.mockImplementation(() => callOrder.push('setFormat'));
    mockSetSelectionMode.mockImplementation(() => callOrder.push('setSelectionMode'));

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(callOrder).toEqual(['setTextEditProperties', 'setFormat', 'setSelectionMode']);
  });

  it('should call setFormat with correct attributes including color', async () => {
    const mockAttributes = {
      fontColor: testColorHex,
      fontSize: 16,
      fontName: 'Helvetica',
      textAlign: 'center',
      bold: true,
      italic: false,
      underline: true,
    };

    mockContentEditorRef.current.getTextAttributes.mockResolvedValue(mockAttributes);

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: [],
      instance: mockInstance,
    });

    expect(mockSetFormat).toHaveBeenCalledWith({
      fontSize: 16,
      textAlign: 'center',
      bold: true,
      italic: false,
      underline: true,
      fontColor: testColorHex,
      color: expect.objectContaining({
        toHexString: expect.any(Function),
      }),
    });
  });

  it('should add new font to fonts array if not already included', async () => {
    mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
      fontColor: testColorHex,
      fontSize: 12,
      fontName: 'TimesNewRoman',
      textAlign: 'left',
    });

    mockGetFontName.mockReturnValue('Times New Roman');

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: ['Arial', 'Helvetica'],
      instance: mockInstance,
    });

    expect(mockSetFonts).toHaveBeenCalledWith(['Arial', 'Helvetica', 'Times New Roman']);
  });

  it('should not add font if already in fonts array', async () => {
    mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
      fontColor: testColorHex,
      fontSize: 12,
      fontName: 'Arial',
      textAlign: 'left',
    });

    mockGetFontName.mockReturnValue('Arial');

    await handleSelectionChange({
      getFontName: mockGetFontName,
      setFonts: mockSetFonts,
      handleColorChange: mockHandleColorChange,
      setTextEditProperties: mockSetTextEditProperties,
      setFormat: mockSetFormat,
      setSelectionMode: mockSetSelectionMode,
      contentEditorRef: mockContentEditorRef,
      isInContentEditMode: true,
      fonts: ['Arial', 'Helvetica'],
      instance: mockInstance,
    });

    expect(mockSetFonts).not.toHaveBeenCalled();
  });

  describe('getFontInfo', () => {
    it('should extract font object with FontSize, Font, and TextAlign', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 14,
        fontName: 'Helvetica',
        textAlign: 'center',
        bold: true,
      });

      mockGetFontName.mockReturnValue('Helvetica');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result.fontObject).toEqual({
        FontSize: 14,
        Font: 'Helvetica',
        TextAlign: 'center',
      });
    });

    it('should create Color instance with fontColor from attributes', async () => {
      // eslint-disable-next-line custom/no-hex-colors
      const customColor = '#00FF00';
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: customColor,
        fontSize: 12,
        fontName: 'Arial',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(mockInstance.Core.Annotations.Color).toHaveBeenCalledWith(customColor);
      expect(result.color).toBeDefined();
      expect(result.color.toHexString()).toBe(customColor);
    });

    it('should return attribute object with all text properties', async () => {
      const mockAttributes = {
        fontColor: testColorHex,
        fontSize: 18,
        fontName: 'Courier',
        textAlign: 'right',
        bold: true,
        italic: true,
        underline: false,
      };

      mockContentEditorRef.current.getTextAttributes.mockResolvedValue(mockAttributes);
      mockGetFontName.mockReturnValue('Courier');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result.attribute).toEqual(mockAttributes);
    });

    it('should call getFontName with fontName from attributes', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 12,
        fontName: 'ArialBoldItalic',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(mockGetFontName).toHaveBeenCalledWith('ArialBoldItalic');
    });

    it('should return all three properties: fontObject, color, and attribute', async () => {
      mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
        fontColor: testColorHex,
        fontSize: 12,
        fontName: 'Arial',
        textAlign: 'left',
      });

      mockGetFontName.mockReturnValue('Arial');

      const result = await getFontInfo(
        mockInstance,
        mockContentEditorRef,
        mockGetFontName
      );

      expect(result).toHaveProperty('fontObject');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('attribute');
    });

    it('should handle different text alignment values', async () => {
      const alignments = ['left', 'center', 'right', 'justify'];

      for (const alignment of alignments) {
        mockContentEditorRef.current.getTextAttributes.mockResolvedValue({
          fontColor: testColorHex,
          fontSize: 12,
          fontName: 'Arial',
          textAlign: alignment,
        });

        mockGetFontName.mockReturnValue('Arial');

        const result = await getFontInfo(
          mockInstance,
          mockContentEditorRef,
          mockGetFontName
        );

        expect(result.fontObject.TextAlign).toBe(alignment);
      }
    });
  });
});