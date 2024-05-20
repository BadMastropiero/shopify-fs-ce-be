import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Model } from 'mongoose';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    try {
      const created = new this.favoriteModel(createFavoriteDto);
      return await created.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to create favorite',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.favoriteModel.find().exec();
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    const favorite = await this.favoriteModel.findOne({ productId: id }).exec();

    if (!favorite) {
      throw new HttpException('Favorite not found', HttpStatus.NOT_FOUND);
    }

    return favorite;
  }

  async remove(id: string) {
    // TODO remove this
    // const all = await this.favoriteModel.find().exec();
    // for (const favorite of all) {
    //   this.favoriteModel.findByIdAndDelete(favorite.id).exec();
    // }

    const result = await this.favoriteModel.deleteOne({ productId: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Favorite not found', HttpStatus.NOT_FOUND);
    }
  }
}
