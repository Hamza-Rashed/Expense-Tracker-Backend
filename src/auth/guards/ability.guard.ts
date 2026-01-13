import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../ability/ability.factory';
import { CHECK_ABILITY, RequiredRule } from '../decorators/ability.decorator';
import { Errors } from 'src/errors/errors.factory';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = 
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || 
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getClass()) || 
      [];

    if (!rules.length) {
      return true; // No ability rules defined, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw Errors.Forbidden('User not authenticated');
    }
    
    const ability = this.abilityFactory.defineAbility(user);
    
    // Check each rule
    const canAccess = rules.every(rule => {      
      return ability.can(rule.action, rule.subject)
    }
    );    

    if (!canAccess) {
      throw Errors.InsufficientPermissions(`Insufficient permissions. You Can't => ( ${rules.map(r => `${r.action} ${r.subject}`).join(', ')} ) In your current role.`);
    }

    return true;
  }
}