import { BadRequestException, Inject, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { VoucherService } from 'src/voucher/voucher.service';
import { VoucherType } from 'src/shared/enums/voucher.type.enum';
import { advisoryRemarksEmailTemplate } from 'src/templates/advisory-remarks-email';
import { TaskService } from 'src/shared/bullmq/task.service';
const brevo = require('@getbrevo/brevo');


@Injectable()
export class BookingService {
  constructor(
    private voucherService: VoucherService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly taskService: TaskService
  ) { }

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
      relations: ['payments', 'user', 'advisor'],
    };

    if (user.roles.includes('admin')) {

    } else if (user.roles.includes('advisor')) {
      query.where = { advisor: { id: user.id } };

    } else {
      query.where = { user: { id: user.id } };
    }

    const bookings = await this.bookingRepository.find(query);

    return bookings;
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto, user?: User) {
    const { calendlyEventId, notes, meetingStartTime, meetingEndTime } = updateBookingDto;
    const updates = {};
    if (calendlyEventId) updates['calendlyEventId'] = calendlyEventId;
    if (meetingStartTime) updates['meetingStartTime'] = meetingStartTime;
    if (meetingEndTime) updates['meetingEndTime'] = meetingEndTime;
    if (notes) updates['notes'] = notes;
    if (Object.keys(updates).length > 0)
      await this.bookingRepository.update(id, updateBookingDto);


    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'advisor'], 
    });

    //The email is only sent if the user role is advisor
    if (user.roles.includes('advisor')) {    
      await this.sendAdvisoryRemarksEmail(booking.user, booking.notes, booking.advisor)
    }
    return booking;
  }

  remove(id: number) {
    this.bookingRepository.delete(id);
  }


  async sendAdvisoryRemarksEmail(user: User, notes: string, advisor: User) {
    if(user.username && user.firstName && advisor.firstName){
      const msg = {
        to: user.username,
        from: process.env.FROM_EMAIL,
        subject: 'Reminder: Review Advisor`s Remarks Before Your Session',
        html: advisoryRemarksEmailTemplate(notes, user.firstName, advisor.firstName),
      };
  
      try{
        await this.taskService.sendAdvisoryRemarksEmailViaBrevo({msg, user});
      }catch(e){
        console.log("The error in sending the advisory reminder remarks is ", e)
      }
    } 
  }




  async redeemVoucher(userId: number, voucherCode: string, amount: number) { /* Thank you CTRL+C / CTRL+V 😀*/
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
