import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createBooking(
    calendlyEventId: string,
    userId: number,
  ): Promise<Booking> {
    const bookingObj = new Booking();
    bookingObj.calendlyEventId = calendlyEventId;
    bookingObj.user = { id: userId } as User;
    return await this.bookingRepository.save(bookingObj);
  }

  findAll(user: User, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const query: any= {
      skip,
      take: limit,
      order: {id: 'DESC' },
      relations: ['payments']
    };

    if (!user.roles.includes('admin'))
      query['where'] = { user: { id: user.id } };

    return this.bookingRepository.find(query);
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const { calendlyEventId } = updateBookingDto;
    const updates = {};
    if (calendlyEventId) updates['calendlyEventId'] = calendlyEventId;
    if (Object.keys(updates).length > 0)
      await this.bookingRepository.update(id, updateBookingDto);
    return this.bookingRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.bookingRepository.delete(id);
  }
}
