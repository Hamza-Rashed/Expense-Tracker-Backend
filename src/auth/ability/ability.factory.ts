import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';
import {
  Action,
  AppAbility,
  UserWithRoles,
  getUserRoles,
  Subjects,
} from '../../shared/enums/ability.types';
import { Role } from './dto/roles-dto';

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserWithRoles): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );

    const userRoles = getUserRoles(user);

    // SYSTEM_OWNER - Can do everything
    if (userRoles === Role.ADMIN) {
      can(Action.Manage, 'all');
    }

    // SUPER_ADMIN - Almost everything
    if (userRoles === Role.USER) {
      can(Action.Manage, 'all');
      cannot(
        [Action.Create, Action.Update, Action.Delete, Action.List],
        'Admin',
      ).because('Cannot modify Admin Info');
      cannot(
        [Action.Create, Action.Update, Action.Delete, Action.List],
        'User',
      ).because("User Can't do actions with other users");
    }

    // SIMPLEST FIX: Use a basic detectSubjectType for string-based subjects
    return build({
      detectSubjectType: (item) => this.detectSubjectType(item),
    });
  }

  private detectSubjectType(item: unknown): ExtractSubjectType<Subjects> {
    // Handle string subjects (our main use case)
    if (typeof item === 'string') {
      return item as ExtractSubjectType<Subjects>;
    }

    // Handle objects with constructor
    if (
      item &&
      typeof item === 'object' &&
      item.constructor &&
      item.constructor.name
    ) {
      return item.constructor.name as ExtractSubjectType<Subjects>;
    }

    // Handle case when item is one of our subject types
    const subjectTypes: Subjects[] = ['Admin', 'User', 'all'];
    if (typeof item === 'string' && subjectTypes.includes(item as Subjects)) {
      return item as ExtractSubjectType<Subjects>;
    }

    // Default fallback
    return 'all' as ExtractSubjectType<Subjects>;
  }
}
