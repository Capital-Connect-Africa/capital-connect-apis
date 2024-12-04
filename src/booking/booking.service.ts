import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { VoucherType } from 'src/shared/enums/voucher.type.enum';

@Injectable()
export class BookingService {
  constructor(
    private voucherService:VoucherService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createBooking(
    calendlyEventId: string,
    notes: string,
    userId: number,
  ): Promise<Booking> {
    const bookingObj = new Booking();
    bookingObj.calendlyEventId = calendlyEventId;
    bookingObj.notes = notes;
    bookingObj.user = { id: userId } as User;
    return await this.bookingRepository.save(bookingObj);
  }

  async findAll(
    user: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<Booking[]> {
    const skip = (page - 1) * limit;
  
    const query: any = {
      skip,
      take: limit,
      order: { id: 'DESC' },
      relations: ['payments', 'user'],
    };
  
    if (user.roles.includes('admin')) {

    } else if (user.roles.includes('advisor')) {
      query.where = { advisor: { id: user.id } };

    } else {
      query.where = { user: { id: user.id } };
    }
  
    const bookings = await this.bookingRepository.find(query);
  
    return bookings ;
  }  

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const { calendlyEventId, notes } = updateBookingDto;
    const updates = {};
    if (calendlyEventId) updates['calendlyEventId'] = calendlyEventId;
    if (notes) updates['notes'] = notes;
    if (Object.keys(updates).length > 0)
      await this.bookingRepository.update(id, updateBookingDto);
    return this.bookingRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.bookingRepository.delete(id);
  }

  async redeemVoucher(userId:number, voucherCode:string, amount:number){ /* Thank you CTRL+C / CTRL+V 😀*/
    try {
      const { 
        maxAmount,  
        discount 
        
      } = await this.voucherService.redeemVoucher(
        userId, 
        voucherCode, 
        VoucherType.AdvisorySession
      );
  
      const amountDiscounted = Math.min(
        maxAmount, 
        (discount / 100) * amount
      );
  
      return { 
        discount: amountDiscounted, 
        amount: amount - amountDiscounted 
      }
    } catch (error) {
      throw error as BadRequestException;
    }
  }

  async assignAdvisorToBooking(
    bookingId: number,
    userId: number, 
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });
  
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
  
    const advisor = await this.usersRepository.findOne({
      where: { id: userId, roles: 'advisor' }, 
    });
  
    if (!advisor) {
      throw new NotFoundException('No advisor found with the given userId');
    }
  
    booking.advisor = advisor;

    return await this.bookingRepository.save(booking);
  }
  
  
}
