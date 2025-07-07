import { PartialType } from "@nestjs/mapped-types"
import { CreateUserDTO } from "src/modules/users/domain/dto/create-user.dto"

export class AuthRegisterDTO extends PartialType(CreateUserDTO){}
