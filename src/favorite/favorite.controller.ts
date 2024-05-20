import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('favorite')
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Get('favorites')
  findAll() {
    return this.favoriteService.findAll();
  }

  @Get('favorite/:id')
  findOne(@Param('id') id: string) {
    return this.favoriteService.findOne(id);
  }

  @Delete('favorite/:id')
  remove(@Param('id') id: string) {
    return this.favoriteService.remove(id);
  }
}
