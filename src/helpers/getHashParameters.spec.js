import { getInstanceNode } from './getRootNode';

jest.mock('./getRootNode', () => ({
  getInstanceNode: jest.fn(() => ({
    getAttribute:jest.fn(),
  })),
}));

describe('getHashParameters', () => {
  it('should return the initialDoc URL when it has query parameters', async () => {
    window.isApryseWebViewerWebComponent = true;
    // URL with query parameters and special characters
    const urlWithQueryParams = 'https://s3.us-east-005.backblazeb2.com/shade-test/blobs/main-13851357-18c1b994613d7b8ddea71369087639e66e3374ff536c5b76c460ec2dd8d52190.data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=00529bac29059af0000000017%2F20250116%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20250116T025404Z&X-Amz-Expires=86400&X-Amz-Signature=447b9d4e384fc0a7effae7e143d38f14d82493a313a0d46a88a91ac6ed305064&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B filename%3D"PLG GTM Strategy - (1).docx"&response-content-type=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document&x-id=GetObject](https://s3.us-east-005.backblazeb2.com/shade-test/blobs/main-13851357-18c1b994613d7b8ddea71369087639e66e3374ff536c5b76c460ec2dd8d52190.data?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=00529bac29059af0000000017%2F20250116%2Fus-east-005%2Fs3%2Faws4_request&X-Amz-Date=20250116T025404Z&X-Amz-Expires=86400&X-Amz-Signature=447b9d4e384fc0a7effae7e143d38f14d82493a313a0d46a88a91ac6ed305064&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22PLG%20GTM%20Strategy%20-%20%281%29.docx%22&response-content-type=application%2Fvnd.openxmlformats-officedocument.wordprocessingml.document&x-id=GetObject)';

    const getHashParameter = (await import('./getHashParameters')).default;

    getInstanceNode.mockReturnValue({
      getAttribute: jest.fn().mockReturnValue(urlWithQueryParams),
    });

    const result = getHashParameter('initialDoc');
    expect(result).toBe(JSON.stringify(urlWithQueryParams));
  });
});
