import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a favorite', async () => {
    const dto: CreateFavoriteDto = { productId: '123' };
    jest.spyOn(service as any, 'create').mockResolvedValueOnce(dto);
    expect(await controller.create(dto)).toEqual(dto);
  });

  it('should find all favorites', async () => {
    const result = [];
    jest.spyOn(service, 'findAll').mockResolvedValueOnce(result);
    expect(await controller.findAll()).toEqual(result);
  });

  it('should find one favorite', async () => {
    const result = { productId: '123' };
    jest.spyOn(service as any, 'findOne').mockResolvedValueOnce(result);
    expect(await controller.findOne('123')).toEqual(result);
  });

  it('should remove a favorite', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce();
    await controller.remove('123');
    expect(service.remove).toBeCalledWith('123');
  });
});
