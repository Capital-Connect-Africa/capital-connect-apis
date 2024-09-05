import { BadRequestException, Controller, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import throwInternalServer from 'src/shared/utils/exceptions.util';
import { CreateFileDto } from './dto/create-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('logo')
  @UseInterceptors(FileInterceptor('logo', { 
    storage: diskStorage({
      destination: './uploads/company-logos',
      filename: (req, file, cb) => {
        const name = file.originalname.split(".")[0];
        const fileExtension = extname(file.originalname);
        const newFileName = name.split(" ").join("_") + fileExtension;
        cb(null, newFileName)
      }
    }),
    fileFilter: (req, file, cb) => {
      if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Wrong file format. Please upload an image file'), false);
      }
      cb(null, true)
    }
   }))
  uploadLogo(@Request() req, @UploadedFile() logo : Express.Multer.File) {
    const createFileDto = new CreateFileDto();
    createFileDto.path = logo.path;
    try {
      this.filesService.createComponyLogo(req.user.id, createFileDto);
      return 'Company logo successfully uploaded!';
    } catch (error) {
      throwInternalServer(error);
    }
  }



  //s3
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-logo')
  async uploadCompanyLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
    try {
      console.log("File", file);
      return await this.filesService.addCompanyLogo(file, req.user.id);
    } catch (err) {
      throwInternalServer(err);
    }
  }

}
