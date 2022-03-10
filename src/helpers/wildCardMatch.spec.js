import wildCardMatch from './wildCardMatch';

const wildCards = ['google.com', 'pdftron.com', 'amazon*.com', '*baidu.cn', 'ali*baba.cn', 'apple.*', '*l.com'];
const sildCardStar = ['*'];
describe('wild card match function', () => {

  it('should match everything!!', () => {
    let count = wildCardMatch(sildCardStar, 'google.com');
    expect(count).toEqual(1);
    count = wildCardMatch(sildCardStar, '123456');
    expect(count).toEqual(1);
    count = wildCardMatch(sildCardStar, 'amazon.com');
    expect(count).toEqual(1);
  });
  it('should match google.com', () => {
    const count = wildCardMatch(wildCards, 'google.com');
    expect(count).toEqual(1);
  });

  it('should match amazon123.com', () => {
    const count = wildCardMatch(wildCards, 'amazon123.com');
    expect(count).toEqual(1);
  });

  it('should not match the card the arr does not include', () => {
    const count = wildCardMatch(wildCards, 'sadamazon123.com');
    expect(count).toEqual(0);
  });

  it('should match 123baidu.cn', () => {
    const count = wildCardMatch(wildCards, '123baidu.cn');
    expect(count).toEqual(1);
  });

  it('should match alibababababa.cn', () => {
    const count = wildCardMatch(wildCards, 'alibababababa.cn');
    expect(count).toEqual(1);
  });

  it('should match apple.com, apple.ca', () => {
    let count = wildCardMatch(wildCards, 'apple.com');
    expect(count).toEqual(1);
    count = wildCardMatch(wildCards, 'apple.ca');
    expect(count).toEqual(1);
  });

  it('should not match linkedin.com', () => {
    const count = wildCardMatch(wildCards, 'linkedin.com');
    expect(count).toEqual(0);
  });
});