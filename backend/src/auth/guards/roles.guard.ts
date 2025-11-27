import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Controllerに@Roles()がついているか確認
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]);
    
    // なければだれでもOK
    if (!requiredRoles) {
        return true;
    }
    
    // ユーザー情報を取得(JwtStrategyでreturnした内容)
    const { user } = context.switchToHttp().getRequest();

    // ユーザーの役割が許可されているか確認
    return requiredRoles.some((role) => user.role === role);
  }
}