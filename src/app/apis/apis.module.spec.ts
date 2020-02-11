import { ApisModule } from './apis.module';

describe('ApisModule', () => {
  let dashboardModule: ApisModule;

  beforeEach(() => {
    dashboardModule = new ApisModule();
  });

  it('should create an instance', () => {
    expect(dashboardModule).toBeTruthy();
  });
});
