import {InitModule} from './init.module';

describe('InitModule', () => {
  let polymerModule: InitModule;

  beforeEach(() => {
    polymerModule = new InitModule();
  });

  it('should create an instance', () => {
    expect(polymerModule).toBeTruthy();
  });
});
