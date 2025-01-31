import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { CallbackPaymentDto } from './dto/callback-payment.dto';
import { UserSubscription } from '../subscription_tier/entities/userSubscription.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepository: Repository<UserSubscription>,
    private readonly httpService: HttpService,
  ) {}

  async processPaymentCallback(
    pesapalToken: string,
    callbackPaymentDto: CallbackPaymentDto,
  ) {
    console.log('Processing payment callback with token:', pesapalToken);
    const { OrderTrackingId } = callbackPaymentDto;
    const pesapalPayment = await this.checkPaymentStatus(
      pesapalToken,
      OrderTrackingId,
    );
    const payment = await this.paymentsRepository.findOne({
      where: {
        orderTrackingId: OrderTrackingId,
      },
      relations: ['userSubscription', 'userSubscription.user'],
    });
    if (!payment)
      throw new NotFoundException(
        `Payment with order tracking id ${OrderTrackingId} not found`,
      );
    payment.status = pesapalPayment.payment_status_description;
    const updatedPayment = await this.paymentsRepository.save(payment);
    if (
      updatedPayment.userSubscription &&
      updatedPayment.status === 'Completed'
    ) {
      const activeSubscriptions = await this.userSubscriptionRepository.find({
        where: { isActive: true, user: { id: updatedPayment.user.id } },
      });
      for (const subscription of activeSubscriptions) {
        subscription.isActive = false;
        await this.userSubscriptionRepository.save(subscription);
      }
      const userSubscription = await this.userSubscriptionRepository.findOneBy({
        id: updatedPayment.userSubscription.id,
      });
      userSubscription.isActive = true;
      await this.userSubscriptionRepository.save(userSubscription);
    }

    return { message: 'Payment processed successfully' };
  }

  async checkPaymentStatus(pesapalToken: string, orderTrackingId: string) {
    const response = await this.httpService
      .get(
        `${process.env.PESAPAL_BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pesapalToken}`,
          },
        },
      )
      .toPromise();

    if (response.status !== 200)
      throw new HttpException('Failed to fetch payment', 500);

    return response.data;
  }

  async createBookingPayment(createPaymentDto: CreatePaymentDto) {
    const { orderTrackingId, bookingId, userSubscriptionId, userId, discount } =
      createPaymentDto;
    const paymentObj = new Payment();
    paymentObj.currency = process.env.CURRENCY || 'KES';
    paymentObj.amount = Number(process.env.ADVISORY_SESSIONS_COST) || 10000;
    paymentObj.status = 'initiated';
    paymentObj.discount = discount ?? 0;
    paymentObj.description = 'Advisory session payment';
    paymentObj.orderTrackingId = orderTrackingId;
    paymentObj.user = { id: userId } as User;
    if (bookingId) paymentObj.booking = { id: bookingId } as Booking;
    if (userSubscriptionId)
      paymentObj.userSubscription = { id: bookingId } as UserSubscription;
    const payment = await this.paymentsRepository.save(paymentObj);
    return payment;
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
    amount: number,
    description: string,
  ) {
    const { orderTrackingId, bookingId, userSubscriptionId, userId, discount } =
      createPaymentDto;
    const paymentObj = new Payment();
    paymentObj.currency = process.env.CURRENCY || 'KES';
    paymentObj.amount = amount;
    paymentObj.status = 'initiated';
    paymentObj.discount = discount ?? 0;
    paymentObj.description = description;
    paymentObj.orderTrackingId = orderTrackingId;
    paymentObj.user = { id: userId } as User;
    if (bookingId) paymentObj.booking = { id: bookingId } as Booking;
    if (userSubscriptionId) {
      paymentObj.userSubscription = {
        id: userSubscriptionId,
      } as UserSubscription;
    }
    return await this.paymentsRepository.save(paymentObj);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.paymentsRepository.findAndCount({
      skip,
      take: limit,
      relations: [
        'booking',
        'userSubscription',
        'userSubscription.subscriptionTier',
        'user',
      ],
      order: { id: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: [
        'booking',
        'userSubscription',
        'userSubscription.subscriptionTier',
        'user',
      ],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const { currency, amount, description, status, orderTrackingId } =
      updatePaymentDto;
    const updates = {};
    if (currency) updates['currency'] = currency;
    if (amount) updates['amount'] = amount;
    if (description) updates['description'] = description;
    if (status) updates['status'] = status;
    if (orderTrackingId) updates['OrderTrackingId'] = orderTrackingId;
    if (Object.keys(updates).length > 0)
      await this.paymentsRepository.update(id, updatePaymentDto);
    return this.paymentsRepository.findOneBy({ id });
  }

  remove(id: number) {
    this.paymentsRepository.delete(id);
  }

  findPaymentsByUserId(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.paymentsRepository.find({
      where: { user: { id: userId } },
      skip,
      take: limit,
      relations: ['booking', 'userSubscription'],
    });
  }

  findPaymentsByUserIdPastWeek(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const skip = (page - 1) * limit;
    return this.paymentsRepository.find({
      where: {
        user: { id: userId },
        createdAt: MoreThan(weekAgo),
        status: In(['initiated', 'Failed']),
      },
      skip,
      take: limit,
      relations: [
        'booking',
        'userSubscription',
        'userSubscription.subscriptionTier',
      ],
    });
  }
}
