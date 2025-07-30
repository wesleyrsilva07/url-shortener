import { Test } from '@nestjs/testing';
import { RedirectController } from '../redirect.controller';
import { RedirectUseCase } from '../../usecases/redirect.usecase';

describe('RedirectController', () => {
  let controller: RedirectController;
  let usecase: RedirectUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [
        {
          provide: RedirectUseCase,
          useValue: {
            handleRedirect: jest.fn()
          }
        }
      ]
    }).compile();
    controller = moduleRef.get<RedirectController>(RedirectController);
    usecase = moduleRef.get<RedirectUseCase>(RedirectUseCase);
  });

  it('should call handleRedirect and return url', async () => {
    jest
      .spyOn(usecase, 'handleRedirect')
      .mockResolvedValue('https://original.com');
    const res = { redirect: jest.fn() } as any;
    await controller.redirect('abc123', res);
    expect(res.redirect).toHaveBeenCalledWith('https://original.com');
    expect(usecase.handleRedirect).toHaveBeenCalledWith('abc123');
  });
});
