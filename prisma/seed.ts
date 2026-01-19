import { PrismaClient, Roles, TransactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const password = await bcrypt.hash('123456', 10);

  // =========================
  // USERS
  // =========================
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@test.com',
      password,
      role: Roles.admin,
      status: 'active',
    },
  });

  const user = await prisma.user.create({
    data: {
      fullName: 'Normal User',
      email: 'user@test.com',
      password,
      role: Roles.user,
      status: 'active',
    },
  });

  // =========================
  // CATEGORIES
  // =========================
  const adminCategories = await prisma.category.createMany({
    data: [
      { name: 'Salary', userId: admin.id },
      { name: 'Food', userId: admin.id },
      { name: 'Travel', userId: admin.id },
    ],
  });

  const userCategories = await prisma.category.createMany({
    data: [
      { name: 'Salary', userId: user.id },
      { name: 'Groceries', userId: user.id },
      { name: 'Entertainment', userId: user.id },
    ],
  });

  const adminSalary = await prisma.category.findFirst({
    where: { name: 'Salary', userId: admin.id },
  });

  const adminFood = await prisma.category.findFirst({
    where: { name: 'Food', userId: admin.id },
  });

  const userSalary = await prisma.category.findFirst({
    where: { name: 'Salary', userId: user.id },
  });

  const userGroceries = await prisma.category.findFirst({
    where: { name: 'Groceries', userId: user.id },
  });

  // =========================
  // BUDGETS
  // =========================
  await prisma.budget.createMany({
    data: [
      {
        amount: 1000,
        categoryId: adminFood!.id,
      },
      {
        amount: 500,
        categoryId: userGroceries!.id,
      },
    ],
  });

  // =========================
  // TRANSACTIONS
  // =========================
  await prisma.transaction.createMany({
    data: [
      // ADMIN
      {
        amount: 3000,
        type: TransactionType.income,
        date: new Date('2026-01-01'),
        userId: admin.id,
        categoryId: adminSalary!.id,
      },
      {
        amount: 200,
        type: TransactionType.expense,
        date: new Date('2026-01-05'),
        userId: admin.id,
        categoryId: adminFood!.id,
      },

      // USER
      {
        amount: 2000,
        type: TransactionType.income,
        date: new Date('2026-01-01'),
        userId: user.id,
        categoryId: userSalary!.id,
      },
      {
        amount: 150,
        type: TransactionType.expense,
        date: new Date('2026-01-03'),
        userId: user.id,
        categoryId: userGroceries!.id,
      },
    ],
  });

  console.log('✅ Seeding finished successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
