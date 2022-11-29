import { lastValueFrom, of } from 'rxjs';
import { AppInterceptor } from './app.interceptor';

describe('AppInterceptor', () => {
  let interceptor: AppInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new AppInterceptor();
  });

  it('should be defined', async () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of('Hello World!'),
    });

    await expect(lastValueFrom(obs$)).resolves.toEqual({
      statusCode: 200,
      message: 'success',
      data: 'Hello World!',
    });
  });
});
