import generateSlug from './generateSlug';

describe('generate string to slug', () => {
  it('should convert a string to lower case', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with dashes', () => {
    expect(generateSlug('This is a test')).toBe('this-is-a-test');
  });
});
