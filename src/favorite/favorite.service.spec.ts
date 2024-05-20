import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { getModelToken } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Model } from 'mongoose';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let model: Model<Favorite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getModelToken(Favorite.name),
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    model = module.get<Model<Favorite>>(getModelToken(Favorite.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a favorite', async () => {
    const dto: CreateFavoriteDto = { productId: '123' };
    jest.spyOn(model as any, 'new').mockImplementationOnce(() => ({
      save: () => Promise.resolve(dto),
    }));
    expect(await service.create(dto)).toEqual(dto);
  });

  it('should find all favorites', async () => {
    const result = [];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    expect(await service.findAll()).toEqual(result);
  });

  it('should find one favorite', async () => {
    const result = { productId: '123' };
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    expect(await service.findOne('123')).toEqual(result);
  });

  it('should remove a favorite', async () => {
    const result = { deletedCount: 1 };
    jest.spyOn(model, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(result),
    } as any);
    await service.remove('123');
    expect(model.deleteOne).toBeCalledWith({ productId: '123' });
  });
});
