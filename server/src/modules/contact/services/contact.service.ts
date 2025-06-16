/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactDto, FilterContactDto, UpdateContactDto } from '../dtos';
import fs from 'fs';
import { Repository } from 'typeorm';
import { ContactEntity } from '../entities/contact.entity';

@Injectable()
export class ContactService {
  private logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(ContactEntity)
    private readonly ContactRepo: Repository<ContactEntity>,
  ) {}

  getContacts(
    ctx: RequestContextDto,
    filterContactDto: FilterContactDto,
  ): Promise<ContactEntity[]> {
    this.logger.log(`${this.getContacts.name} called`);

    const reqQuery: any = {};

    return this.ContactRepo.find({ where: reqQuery });
  }

  async getContactsNested(ctx: RequestContextDto): Promise<ContactEntity[]> {
    this.logger.log(`${this.getContacts.name} called`);
    const start = process.hrtime();

    const qb = this.ContactRepo.createQueryBuilder('Contact').select([
      'Contact.id',
    ]);

    const result = await qb.getMany();

    const stop = process.hrtime(start);
    this.logger.log(
      `Getting nested Contact took ${(stop[0] * 1e9 + stop[1]) / 1e6} ms`,
    );

    return result;
  }

  getContactsWithRelation(
    ctx: RequestContextDto,
    filterContactDto: FilterContactDto,
  ): Promise<ContactEntity[]> {
    this.logger.log(`${this.getContacts.name} called`);

    const reqQuery: any = {};

    return this.ContactRepo.find({
      where: reqQuery,
    });
  }

  async getContact(ctx: RequestContextDto, id: string): Promise<ContactEntity> {
    this.logger.log(`${this.getContact.name} called`);

    const Contact = await this.ContactRepo.findOne({ where: { id } });
    if (!Contact) {
      throw new NotFoundException(`Contact of id ${id} not found.`);
    }

    return Contact;
  }

  async createContact(
    ctx: RequestContextDto,
    createContactDto: CreateContactDto,
  ): Promise<ContactEntity> {
    this.logger.log(`${this.createContact.name} called`);

    const Contact = this.ContactRepo.create(createContactDto);

    await this.ContactRepo.save(Contact);

    // const logDto = { actionType: LogActionType.Create,  ContactId: Contact.id } as CreateLogDto;
    // await this.logService.createUserLog(ctx, logDto);

    return Contact;
  }

  async updateContact(
    ctx: RequestContextDto,
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<ContactEntity> {
    this.logger.log(`${this.updateContact.name} called`);

    const Contact = await this.getContact(ctx, id);
    this.ContactRepo.merge(Contact, updateContactDto);
    await this.ContactRepo.save(Contact);
    return Contact;
  }

  async deleteContact(
    ctx: RequestContextDto,
    id: string,
  ): Promise<ContactEntity> {
    this.logger.log(`${this.deleteContact.name} called`);

    const Contact = await this.getContact(ctx, id);
    await this.ContactRepo.remove(Contact);

    return Contact;
  }

  clearContactData() {
    this.logger.log(`${this.clearContactData.name} called`);
    return this.ContactRepo.clear();
  }

  async initiateContactData(): Promise<ContactEntity[]> {
    this.logger.log(`${this.initiateContactData.name} called`);

    // await this.ContactRepo.clear()
    // this.logger.log(`Contact data cleared`);
    const ContactData = JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../../../../mock-data/bd-location/Contacts.json`,
        'utf-8',
      ),
    );
    const Contacts = this.ContactRepo.create(ContactData);

    return this.ContactRepo.save(Contacts);
  }
}
