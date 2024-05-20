import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { getModelToken } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { connect, Connection, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let model: Model<Favorite>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  const dto: CreateFavoriteDto = { productId: '123' };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    model = mongoConnection.model(Favorite.name, FavoriteSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getModelToken(Favorite.name),
          useValue: model,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    // model = module.get<Model<Favorite>>(getModelToken(Favorite.name));
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a favorite', async () => {
    await service.create(dto);
    expect(
      await model.findOne({ productId: dto.productId }).exec(),
    ).toBeTruthy();
  });

  it('should find all favorites', async () => {
    const result = [{ productId: '123' }, { productId: '456' }];
    for (const favorite of result) {
      await service.create(favorite);
    }
    const res = await model.find().exec();
    expect(res.map(({ productId }) => ({ productId }))).toEqual(result);
  });

  it('should find one favorite', async () => {
    await service.create(dto);
    expect(await service.findOne(dto.productId)).toMatchObject(dto);
  });

  it('should remove a favorite', async () => {
    await service.create(dto);
    await service.remove(dto.productId);
    expect(
      await model.findOne({ productId: dto.productId }).exec(),
    ).toBeFalsy();
  });
});
