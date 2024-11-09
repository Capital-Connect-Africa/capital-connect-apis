import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, RequestMethod, UnauthorizedException } from "@nestjs/common";

export const handleError = (error: HttpException, method: RequestMethod):never =>{
   const {message, getStatus} =error;

   if(!getStatus) throw new InternalServerErrorException(message)
   const errorMessage = message;
   const statusCode = getStatus();

   switch (statusCode) {
    case HttpStatus.BAD_REQUEST: throw new BadRequestException(errorMessage);
    case HttpStatus.UNAUTHORIZED: throw new UnauthorizedException(errorMessage);
    case HttpStatus.FORBIDDEN: throw new ForbiddenException(errorMessage);
    case HttpStatus.NOT_FOUND: throw new NotFoundException(errorMessage);
    case HttpStatus.CONFLICT: throw new ConflictException(errorMessage);
    default:
        if([RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH].includes(method)) throw new BadRequestException(errorMessage);
        throw new InternalServerErrorException(errorMessage);
   }
}    