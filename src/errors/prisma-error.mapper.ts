import { Prisma } from '@prisma/client';
import { Errors } from 'src/errors/errors.factory';

export function mapPrismaError(error: unknown) {

  // Unique constraint
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const e = error as Prisma.PrismaClientKnownRequestError; // cast
    switch (e.code) {

      case 'P2002':
        return Errors.DuplicateResource(
          `Duplicate value for field(s): ${e.meta?.target}`
        );

      case 'P2003':
        return Errors.BadRequest('Invalid foreign key reference Or have some related records');

      case 'P2025':
        return Errors.ResourceNotFound('Requested record not found');

      default:
        return Errors.InternalServerError('Database error');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return Errors.Validation(
      'database',
      'Invalid data structure sent to database'
    );
  }

  return null;
}