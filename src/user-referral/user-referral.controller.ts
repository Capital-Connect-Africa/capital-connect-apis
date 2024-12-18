import { Body, Controller, Delete, ForbiddenException, Get, Param, Put, Query, Request, RequestMethod, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserReferralService } from './user-referral.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { ErrorDto } from 'src/shared/generic/error.dto';
import { handleError } from 'src/shared/helpers/error-handler.helper';
import { Referral } from './entities/referral.entity';
import { UpdateReferralMetricsDto } from './dto/UpdateReferralMetricsDto';
import { JwtService } from '@nestjs/jwt';

@ApiTags('user referrals')
@Controller('referrals')
export class UserReferralController {
    constructor(private userReferralService: UserReferralService, private jwtService: JwtService){}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    @ApiOperation({ summary: 'Gets all referrals'  })
    @ApiOkResponse({ description: 'Referrals retrieved successfully', type: [Referral], isArray: true})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired', type: ErrorDto})
    @ApiForbiddenResponse({description: 'User access not allowed', type: ErrorDto})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃', type: ErrorDto})
    async findReferrals(@Query('page') page: number, @Query('limit') limit: number) {
        try {
            const referrals =await this.userReferralService.findReferrals(page, limit);
            return referrals;
        } catch (error) { 
            handleError(error, RequestMethod.GET);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user/:userId')
    @ApiOperation({ summary: 'Gets all user referrals'  })
    @ApiOkResponse({ description: 'User Referrals retrieved successfully', type: [Referral], isArray: true})
    @ApiUnauthorizedResponse({ description: 'Login required. Possibly user session expired', type: ErrorDto})
    @ApiForbiddenResponse({description: 'User access not allowed', type: ErrorDto})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃', type: ErrorDto})
    async findUserReferrals(@Param('userId') userId: number, @Query('page') page: number, @Query('limit') limit: number, @Request() req: any) {
        try {
            const loggedInUser = req.user;
            // console.log(loggedInUser.roles);
            
            // if (loggedInUser.id !== userId || !loggedInUser.roles.includes(Role.Admin)) {
            //     throw new ForbiddenException('Invalid request'); // forbid unauthorized requests to user referrals
            // }
            const referrals =await this.userReferralService.findUserReferrals(userId, page, limit);
            return referrals;
        } catch (error) { 
            handleError(error, RequestMethod.GET);
        }
    }

    @Put('metrics/:referralId')
    @ApiOperation({ summary: 'Updates countable metrics of the user referral'  })
    @ApiNoContentResponse({ description: 'Metric updated successfully'})
    @ApiBadRequestResponse({description: 'Invalid data provided', type: ErrorDto})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃', type: ErrorDto})
    async updateUserReferrals(@Param('referralId') referralId: string, @Body() body: UpdateReferralMetricsDto) {
        try {
            const { userId } =this.jwtService.decode(referralId);
            const referrals =await this.userReferralService.updateUserReferrals(userId as number, body);
            return referrals;
        } catch (error) { 
            handleError(error, RequestMethod.PUT);
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':referralId')
    @ApiOperation({ summary: 'Removes a referral from the database'  })
    @ApiNoContentResponse({ description: 'Referral removed successfully'})
    @ApiNotFoundResponse({description: 'Referral not found', type: ErrorDto})
    @ApiInternalServerErrorResponse({description: 'A little server oopsy occured! Not your bad 😃', type: ErrorDto})
    async removeReferral(@Param('referralId') referralId: string) {
        try {
            return await this.userReferralService.removeReferral(+referralId);
        } catch (error) { 
            handleError(error, RequestMethod.DELETE);
        }
    }
}
