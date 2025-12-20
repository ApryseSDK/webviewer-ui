import { getInstanceNode } from './getRootNode';

jest.mock('./getRootNode', () => ({
  getInstanceNode: jest.fn(() => ({
    getAttribute: jest.fn(),
  })),
}));

describe('getHashParameters', () => {
  let getHashParameter;

  beforeEach(async () => {
    window.isApryseWebViewerWebComponent = true;
    window.Core = { getHashParameter: jest.fn() };
    getInstanceNode.mockReset();
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(undefined),
    });
    window.history.replaceState({}, '', 'http://localhost/');
    getHashParameter = (await import('./getHashParameters')).default;
  });

  afterEach(() => {
    window.history.replaceState({}, '', 'http://localhost/');
    getInstanceNode.mockReset();
    window.isApryseWebViewerWebComponent = true;
  });

  it('returns the default when no attribute is present', () => {
    const result = getHashParameter('licenseKey', 'fallback');
    expect(result).toBe('fallback');
  });

  it('requests corrected attribute name for alias parameters', () => {
    const getAttribute = jest.fn().mockReturnValue('alias-doc');
    getInstanceNode.mockReturnValue({
      getAttribute,
    });

    const result = getHashParameter('d', '');

    expect(getAttribute).toHaveBeenCalledWith('initialDoc');
    expect(result).toBe(JSON.stringify('alias-doc'));
  });

  it('returns true or false when a boolean default is provided', () => {
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('1'),
    });
    expect(getHashParameter('fullAPI', false)).toBe(true);

    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('0'),
    });
    expect(getHashParameter('fullAPI', true)).toBe(false);
  });

  it('trims non-JSON strings and does not fall back to default', () => {
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('  trimmed value  '),
    });

    expect(getHashParameter('customParam', 'fallback')).toBe('trimmed value');
  });

  it('returns raw string when boolean default is provided but value is non-boolean-like', () => {
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('yes'),
    });

    expect(getHashParameter('fullAPI', false)).toBe('yes');
  });

  it('returns empty string when attribute is whitespace and default is empty', () => {
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('   '),
    });

    expect(getHashParameter('customParam', '')).toBe('');
  });

  it('falls back to default when attribute is null', () => {
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(null),
    });

    expect(getHashParameter('customParam', 'default')).toBe('default');
  });

  it('returns joined string when JSON parses to an array for non-JSON params', () => {
    const elements = '["a","b","c"]';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(elements),
    });

    expect(getHashParameter('disabledElements', '')).toBe('a,b,c');
  });

  it('stringifies parsed arrays when a JSON format is required', () => {
    const docs = '["doc1.pdf","doc2.pdf"]';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(docs),
    });

    const result = getHashParameter('d', '');
    expect(result).toBe(JSON.stringify(JSON.parse(docs)));
  });

  it('returns JSON string when initialDoc contains invalid JSON', () => {
    const malformed = '["missing end bracket"';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(malformed),
    });

    const result = getHashParameter('initialDoc', '');
    expect(result).toBe(JSON.stringify(malformed));
  });

  it('returns trimmed string when JSON parsing fails for non-JSON params', () => {
    const malformed = '["missing end bracket"';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(malformed),
    });

    expect(getHashParameter('extension', 'default')).toBe(malformed);
  });

  it('parses arrays even when JSON contains whitespace', () => {
    const spacedArray = ' [ "docx" , "xlsx" ] ';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(spacedArray),
    });

    expect(getHashParameter('extension', '')).toBe('docx,xlsx');
  });

  it('stringifies array attribute values directly', () => {
    const arrayValue = ['one', 'two'];
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(arrayValue),
    });

    expect(getHashParameter('initialDoc', '')).toBe(JSON.stringify(arrayValue));
  });

  it('falls back when no instance node is available', () => {
    getInstanceNode.mockReturnValue(null);

    expect(getHashParameter('unknown', 'default')).toBe('default');
  });

  it('defers to window.Core.getHashParameter when not a web component', () => {
    window.isApryseWebViewerWebComponent = false;
    const coreGetter = jest.fn().mockReturnValue('core-value');
    window.Core = { getHashParameter: coreGetter };

    jest.isolateModules(() => {
      const module = require('./getHashParameters').default;
      const result = module('paramName', 'default');

      expect(coreGetter).toHaveBeenCalledWith('paramName', 'default');
      expect(result).toBe('core-value');
    });
  });

  it('should return the initialDoc URL when it has query parameters', () => {
    const urlWithQueryParams = 'https://s3.us-east-005.backblazeb2.com/shade-test/blobs/main-13851357-18c1b994613d7b8ddea71369087639e66e3374ff536c5b76c460ec2dd8d52190.data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=00529bac29059af0000000017%2F20250116%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20250116T025404Z&X-Amz-Expires=86400&X-Amz-Signature=447b9d4e384fc0a7effae7e143d38f14d82493a313a0d46a88a91ac6ed305064&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B filename%3D"PLG GTM Strategy - (1).docx"&response-content-type=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document&x-id=GetObject](https://s3.us-east-005.backblazeb2.com/shade-test/blobs/main-13851357-18c1b994613d7b8ddea71369087639e66e3374ff536c5b76c460ec2dd8d52190.data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=00529bac29059af0000000017%2F20250116%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20250116T025404Z&X-Amz-Expires=86400&X-Amz-Signature=447b9d4e384fc0a7effae7e143d38f14d82493a313a0d46a88a91ac6ed305064&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22PLG%20GTM%20Strategy%20-%20%281%29.docx%22&response-content-type=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document&x-id=GetObject)';

    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(urlWithQueryParams),
    });

    const result = getHashParameter('initialDoc', '');
    expect(result).toBe(JSON.stringify(urlWithQueryParams));
  });

  it('should return a JSON string for a blob URL provided in the hash', () => {
    const blobUrl = 'blob:http://localhost:3000/1234';
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(blobUrl),
    });

    const result = getHashParameter('d', '');
    expect(result).toBe(JSON.stringify(blobUrl));
  });

  it('should return a JSON string representing multiple documents when provided as an attribute', () => {
    const docs = ['doc1.pdf', 'doc2.pdf'];
    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(JSON.stringify(docs)),
    });

    const result = getHashParameter('d', '');
    expect(result).toBe(JSON.stringify(docs));
    expect(JSON.parse(result)).toEqual(docs);
  });

  it('should return a comma-separated string for disabledElements array', () => {
    const elements = '["element1","element2","element3"]';

    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(elements),
    });

    const result = getHashParameter('disabledElements', '');
    expect(result).toBe('element1,element2,element3');
  });

  it('should return a comma-separated string for extension array', () => {
    const extension = '["docx","xlsx","pdf"]';

    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(extension),
    });

    const result = getHashParameter('extension', '');
    expect(result).toBe('docx,xlsx,pdf');
  });
});
