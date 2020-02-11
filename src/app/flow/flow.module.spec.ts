import {FlowModule} from './flow.module';

describe('FlowModule', () => {
  let bomModule: FlowModule;

  beforeEach(() => {
    bomModule = new FlowModule();
  });

  it('should create an instance', () => {
    expect(bomModule).toBeTruthy();
  });
});
