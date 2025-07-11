import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(
    context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const id = request.params.id
    const user = request.user
    if (user.id !== Number(id)) {
      throw new UnauthorizedException(
        'Você não esta autorizado para fazer a operação'
      )
    }

    return true
  }
}
