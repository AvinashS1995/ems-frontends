import { InitialNamePipe } from './initial-name.pipe';

describe('InitialNamePipe', () => {
  it('create an instance', () => {
    const pipe = new InitialNamePipe();
    expect(pipe).toBeTruthy();
  });
});
