import { prisma } from '@/lib/db/prisma';
import { AppError } from '@/lib/errors';

export const creditService = {
  /**
   * Gets the available credit balance for a user.
   */
  async getAvailableCredits(userId: string): Promise<number> {
    const balanceRecord = await prisma.creditBalance.findUnique({
      where: { userId },
    });

    if (!balanceRecord) {
      // If no balance record exists (e.g. older users before this feature), initialize it
      // For older users, we should compute the sum of their transactions or start them at 100
      const sumResult = await prisma.creditTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
      });

      let calculatedBalance = sumResult._sum.amount ?? 0;
      
      // If they have 0 transactions, give them the default 100
      if (calculatedBalance === 0) {
        calculatedBalance = 100;
        await prisma.creditTransaction.create({
          data: {
            userId,
            amount: 100,
            type: 'purchase',
            description: 'Legacy user initialization',
          },
        });
      }

      await prisma.creditBalance.create({
        data: {
          userId,
          balance: calculatedBalance,
        },
      });

      return calculatedBalance;
    }

    return balanceRecord.balance;
  },

  /**
   * Deducts a specific amount of credits from the user's balance.
   * Performs an atomic transaction to keep the history and cache in sync.
   */
  async deductCredits(userId: string, amount: number, description: string, reference?: string) {
    if (amount <= 0) {
      throw new Error('Deduction amount must be positive');
    }

    return await prisma.$transaction(async (tx) => {
      const balanceRecord = await tx.creditBalance.findUnique({
        where: { userId },
      });

      // If they don't have a balance record, default to 100 minus amount (we'll initialize them here)
      if (!balanceRecord) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: 100,
            type: 'purchase',
            description: 'Legacy user initialization',
          },
        });
        
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -amount,
            type: 'spend',
            description,
            reference,
          },
        });

        await tx.creditBalance.create({
          data: {
            userId,
            balance: 100 - amount,
          },
        });
        
        return 100 - amount;
      }

      if (balanceRecord.balance < amount) {
        throw new AppError('Insufficient credits', 400, 'INSUFFICIENT_CREDITS');
      }

      // Record the spend transaction
      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: 'spend',
          description,
          reference,
        },
      });

      // Update the balance cache atomically
      const updatedBalance = await tx.creditBalance.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
        },
      });

      return updatedBalance.balance;
    });
  },
};
