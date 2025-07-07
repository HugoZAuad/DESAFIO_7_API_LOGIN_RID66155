import { AuthGuard } from '../../../shared/guard/auth.guard'
import { ParamId } from '../../../shared/decorators/ParamId.decorator'
import { CreateUserDTO } from '../domain/dto/create-user.dto'
import { updateUserDTO } from '../domain/dto/update-user.dto'
import { Body, Controller, Delete, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { User } from '../../../shared/decorators/user.decorator'
import { UserMatchGuard } from '../../../shared/guard/userMatch.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileValidationInterceptor } from '../../../shared/interceptors/fileValidation.interceptor'
import { FileTypeinterceptor } from '../../../shared/interceptors/fileType.interceptor'
import { CreateUserService } from '../services/createUser.service'
import { DeleteUserService } from '../services/deleteUser.service'
import { FindUserByIdService } from '../services/findUserById.service'
import { UpdateUserService } from '../services/updateUser.service'
import { UploadAvatarUserService } from '../services/uploadAvatarUser.service'
import { FindAllUserService } from '../services/findAllUser.service'
import { Query } from "@nestjs/common"

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly findUserByIdService: FindUserByIdService,
    private readonly findAllUsersService: FindAllUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly uploadAvatarUserService: UploadAvatarUserService,
    
  ) { }

  @Get()
  list(@Query('offset') offset = 0, @Query('limit') limit = 10) {
    return this.findAllUsersService.findAll(Number(offset), Number(limit))
  }

  @Get(':id')
  show(@ParamId() id: number) {
    return this.findUserByIdService.show(id)
  }
  
  @Post()
  createUser(@Body() body: CreateUserDTO) {
    return this.createUserService.execute(body)
  }

  @UseGuards(UserMatchGuard)
  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: updateUserDTO) {
    return this.updateUserService.execute(id, body)
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.deleteUserService.execute(id)
  }

  @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
  @Post('avatar')
  uploadAvatar(
    @User('id') id: number,
    @UploadedFile(FileTypeinterceptor)
    avatar: Express.Multer.File
  ) {
    return this.uploadAvatarUserService.execute(id, avatar.filename)
  }

}
