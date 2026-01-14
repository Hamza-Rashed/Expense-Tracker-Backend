import { 
  PureAbility, 
} from '@casl/ability';

export enum Action {
  Manage = 'manage', // wildcard for any action
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  List = 'list', // for listing multiple records
  ListOwn = 'list_own', // for listing own records
  View = 'view', // for viewing a single record
}

export type Subjects = 'User' | 'Category' | 'Transaction' | 'Budget' |'all'; // => 'all' is a special subject that covers everything

export type AppAbility = PureAbility<[Action, Subjects]>;

export interface UserWithRoles {
  userId: number;
  email: string;
  jti: string;
  role: string;
}

export const getUserRoles = (user: UserWithRoles): string => {
  return user.role;
};