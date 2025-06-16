import { JwtAuthGuard } from '@admin/auth/guards/jwt-auth.guard';
import { RequestContextDto } from '@common/dtos/request-context.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateContactDto, FilterContactDto, UpdateContactDto } from '../dtos';
import { RequestContext } from '@common/decorators/current-user.decorator';
import { ContactService } from '../services/contact.service';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactController {
  private logger = new Logger(ContactController.name);

  constructor(private readonly ContactService: ContactService) {}

  @Get('/')
  async getContacts(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterContactDto: FilterContactDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" retieving Contacts.`);

    const Contacts = await this.ContactService.getContacts(
      ctx,
      filterContactDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of Contacts`,
      totalRecords: Contacts.length,
      data: Contacts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getContact(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const Contact = await this.ContactService.getContact(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Details of Contact of id: ${id}`,
      data: Contact,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createContact(
    @RequestContext() ctx: RequestContextDto,
    @Body() createContactDto: CreateContactDto,
  ) {
    // this.logger.verbose(`User "${ctx.user?.username}" creating new Contact`);

    const Contact = await this.ContactService.createContact(
      ctx,
      createContactDto,
    );

    return {
      success: true,
      statusCode: 201,
      message: `New Contact Created`,
      data: Contact,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateContact(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" updating Contact  of id ${id}`,
    // );

    const Contact = await this.ContactService.updateContact(
      ctx,
      id,
      updateContactDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `Contact of id: ${id} updated`,
      data: Contact,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteContact(
    @RequestContext() ctx: RequestContextDto,
    @Param('id', ParseIntPipe) id: string,
  ) {
    // this.logger.verbose(
    //   `User "${ctx.user?.username}" deleting a Contact  of id ${id}.`,
    // );

    const Contact = await this.ContactService.deleteContact(ctx, id);

    return {
      success: true,
      statusCode: 200,
      message: `Contact of id: ${id} deleted`,
      data: Contact,
    };
  }
  // : Promise<BaseApiSuccessResponse<ContactEntity[]>>

  @UseGuards(JwtAuthGuard)
  @Post('/initiate')
  async initiateContactData(@RequestContext() ctx: RequestContextDto) {
    this.logger.verbose(`User "${ctx.user?.username}" initiate Contact data.`);

    const Contacts = await this.ContactService.initiateContactData();

    return {
      success: true,
      statusCode: 200,
      message: `List of  Contacts`,
      totalRecords: Contacts.length,
      data: Contacts,
    };
  }
}
