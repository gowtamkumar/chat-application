import { FilterColorDto } from '../dtos/filter-color.dto';
import { CreateColorDto } from '../dtos/create-color.dto';
import { ColorService } from '../services/color.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@admin/auth/guards/jwt-auth.guard';
import { UpdateColorDto } from '../dtos';

@UseGuards(JwtAuthGuard)
@Controller('colors')
export class ColorController {
  private readonly logger = new Logger(ColorController.name);

  constructor(private readonly ColorService: ColorService) {}

  @Post('/')
  async createColor(@Body() createColorDto: CreateColorDto) {
    const Color = await this.ColorService.createColor(createColorDto);

    return {
      success: true,
      statusCode: 201,
      message: `New Color created`,
      data: Color,
    };
  }

  @Get('/')
  async getColors(@Query() filterColorDto: FilterColorDto) {
    const Colors = await this.ColorService.getColors(filterColorDto);

    return {
      success: true,
      statusCode: 200,
      message: `List of Color`,
      data: Colors,
    };
  }

  @Get('/:id')
  async getColor(@Param('id', ParseUUIDPipe) id: string) {
    const Color = await this.ColorService.getColor(id);

    return {
      success: true,
      statusCode: 200,
      message: `Color of ID: ${id}`,
      data: Color,
    };
  }

  @Put('/:id')
  async updateColor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    const Color = await this.ColorService.updateColor(id, updateColorDto);

    return {
      success: true,
      statusCode: 200,
      message: `Color of ID ${Color.id} updated`,
      data: Color,
    };
  }

  @Delete('/:id')
  async deleteColor(@Param('id', ParseUUIDPipe) id: string) {
    const Color = await this.ColorService.deleteColor(id);

    return {
      success: true,
      statusCode: 200,
      message: `Color of ${Color.id} deleted`,
      data: Color,
    };
  }
}
