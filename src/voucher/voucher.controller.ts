import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { VoucherService } from './voucher.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { CreateEligibilityRuleDto } from './dto/create-eligibility-rules.dto';
import { UpdateEligibilityRuleDto } from './dto/update-eligibility-rules.dto';
import { generateCryptCode } from 'src/shared/helpers/crypto-generator.helper';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Query, RequestMethod, UseGuards } from '@nestjs/common';
import { handleError } from 'src/shared/helpers/error-handler.helper';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Voucher } from './entities/voucher.entity';
import { EligibilityRule } from './entities/eligibility-rule.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('billing vouchers')
@Controller('vouchers')
export class VoucherController {
    constructor(private voucherService: VoucherService){}

    @Roles(Role.Admin)
    @Post()
    @ApiOperation({ summary: 'Creates a new voucher'  })
    @ApiCreatedResponse({ description: 'New voucher created successfully', type: Voucher})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiBadRequestResponse({description: 'Invalid data provided'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async createVoucher(@Body() body: CreateVoucherDto) {
      try {
        const { type, percentageDiscount, maxUses, expiresAt, rules, maxAmount } = body;
        const code = generateCryptCode().toUpperCase();
        return await this.voucherService.createVoucher(
          { type, percentageDiscount, maxUses, expiresAt, code, maxAmount },
          rules
        );
      } catch (error) { 
        handleError(error, RequestMethod.POST);
      }
    }

    @Roles(Role.Admin)
    @Post('rules/')
    @ApiOperation({ summary: 'Creates a new rule applied when reediming a voucher'  })
    @ApiCreatedResponse({ description: 'New rule created successfully', type: EligibilityRule})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired!'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiBadRequestResponse({description: 'Invalid data provided'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async createRule(@Body() body: CreateEligibilityRuleDto){
        try {
            return await this.voucherService.createRule(body);
            
        } catch (error) {
            throw handleError(error, RequestMethod.POST);
        }
    }

    @Get('list')
    @ApiOperation({ summary: 'Fetch a paginated list of vouchers.'  })
    @ApiOkResponse({ description: 'Vouchers retrieved successfully', type: Voucher, isArray: true})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async findVouchers(@Query('page') page: number, @Query('limit') limit: number) {
        try {
            const vouchers = await this.voucherService.findVouchers(page, limit);
            return vouchers;
            
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }  
    
    @Roles(Role.Admin)
    @Get('rules/list')
    @ApiOperation({ summary: 'Fetch a paginated list of voucher application rules.' })
    @ApiOkResponse({ description: 'Rules retrieved successfully', type: EligibilityRule, isArray: true})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async findRules(@Query('page') page: number, @Query('limit') limit: number){
        try {
            const rules = await this.voucherService.findRules(page, limit);
            return rules;
            
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('find-by-code/:code')
    @ApiOperation({ summary: 'Fetch a single voucher by code'  })
    @ApiOkResponse({ description: 'Voucher retrieved successfully', type: Voucher})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiNotFoundResponse({description: 'Voucher with code not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async findVoucherByCode(@Param('code') code: string){
        if (!code) {
          throw new NotFoundException('Voucher code is required');
        }
        try {
          const voucher = await this.voucherService.findVoucherByCode(code);
          return voucher;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Get('find-by-id/:id')
    @ApiOperation({ summary: 'Fetch a single voucher by id'  })
    @ApiOkResponse({ description: 'Voucher retrieved successfully', type: Voucher})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiNotFoundResponse({description: 'Voucher with code not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async findVoucherById(@Param('id') voucherId: number) {
        if (!voucherId) {
            throw new NotFoundException('Voucher ID is required');
        }
        try {
            const voucher = await this.voucherService.findVoucherById(voucherId);
            return voucher;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }    

    @Roles(Role.Admin)
    @Get('rules/find-by-id/:id')
    @ApiOperation({ summary: 'Fetch a single voucher rule by id'  })
    @ApiOkResponse({ description: 'Voucher retrieved successfully', type: EligibilityRule})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Rule with code not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async findRuleById(@Param('id') ruleId: number){
        try {
            const rule = await this.voucherService.findRuleById(ruleId);
            return rule;
        } catch (error) {
            handleError(error, RequestMethod.GET);
        }
    }

    @Roles(Role.Admin)
    @Put('update/:id')
    @ApiOperation({ summary: 'Update voucher details'  })
    @ApiOkResponse({ description: 'Voucher details updated successfully', type: Voucher})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Voucher with id not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async updateVoucher(
      @Param('id') voucherId: number,
      @Body() updateData: UpdateVoucherDto, 
      @Body('rules') rules: number[] 
    ) {
        try {
            return await this.voucherService.updateVoucher(voucherId, updateData, rules);
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }
    }

    @Roles(Role.Admin)
    @Put('rules/update/:id')
    @ApiOperation({ summary: 'Update voucher rule details'  })
    @ApiOkResponse({ description: 'Rule details updated successfully'})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired', type: EligibilityRule})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Ruel with id not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async updateRule(@Param('id') ruleId: number, @Body() 
    updateEligibilityRuleDto: UpdateEligibilityRuleDto){
        try {
            return await this.voucherService.updateRule(ruleId, updateEligibilityRuleDto);
            
        } catch (error) {
            handleError(error, RequestMethod.PUT);
        }

    }

    @Roles(Role.Admin)
    @Delete('remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove voucher'  })
    @ApiNoContentResponse({ description: 'Voucher removed successfully', type: null})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Voucher with id not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async removeVoucher(@Param('id') id:number){
        try {
            return await this.voucherService.removeVoucher(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @Roles(Role.Admin)
    @Delete('rules/remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove voucher rule'  })
    @ApiNoContentResponse({ description: 'Rule removed successfully'})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired', type: null})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Rule with id not found'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async removeRule(@Param('id') id:number){
        try {
            return await this.voucherService.removeRule(id)
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }

    @Roles(Role.Investor, Role.User)
    @Post('redeem')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Redeem voucher'  })
    @ApiOkResponse({ description: 'Voucher was applied successfully'})
    @ApiBadRequestResponse({description: 'Invalid data provided'})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired'})
    @ApiForbiddenResponse({description: 'User access not allowed'})
    @ApiNotFoundResponse({description: 'Rule with id / voucher with code / user with id not found'})
    @ApiConflictResponse({description: 'User not eligible to apply the voucher'})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃'})
    async redeemVoucher(@Body() body: RedeemVoucherDto) {
        
        try {
            const { userId, voucherCode, purchase } = body;
            const voucherDetails = await this.voucherService.redeemVoucher(userId, voucherCode, purchase);
            return voucherDetails;
        } catch (error) {
            handleError(error, RequestMethod.POST);
        }
    }
}