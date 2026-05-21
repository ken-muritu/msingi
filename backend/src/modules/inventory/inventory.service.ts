import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveStock(productId: string, variantId: string | null, quantity: number, orderId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Pessimistic lock: SELECT ... FOR UPDATE
      const product = variantId
        ? await tx.$queryRawUnsafe(
            `SELECT id, "stockCount" FROM "ProductVariant" WHERE id = $1 FOR UPDATE`,
            variantId,
          )
        : await tx.$queryRawUnsafe(
            `SELECT id, "stockCount" FROM "Product" WHERE id = $1 FOR UPDATE`,
            productId,
          );

      const record = (product as any[])[0];
      if (!record || record.stockCount < quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${record?.stockCount ?? 0}, Requested: ${quantity}`,
        );
      }

      const newStock = record.stockCount - quantity;

      if (variantId) {
        await tx.productVariant.update({
          where: { id: variantId },
          data: { stockCount: newStock },
        });
      } else {
        await tx.product.update({
          where: { id: productId },
          data: { stockCount: newStock },
        });
      }

      // Log the reservation
      await tx.inventoryLog.create({
        data: {
          productId,
          variantId,
          action: 'reservation',
          quantity: -quantity,
          previousStock: record.stockCount,
          newStock,
          reference: orderId,
        },
      });

      return { success: true, previousStock: record.stockCount, newStock };
    });
  }

  async releaseStock(productId: string, variantId: string | null, quantity: number, reference: string) {
    return this.prisma.$transaction(async (tx) => {
      if (variantId) {
        const variant = await tx.productVariant.update({
          where: { id: variantId },
          data: { stockCount: { increment: quantity } },
        });

        await tx.inventoryLog.create({
          data: {
            productId,
            variantId,
            action: 'reservation_release',
            quantity,
            previousStock: variant.stockCount - quantity,
            newStock: variant.stockCount,
            reference,
          },
        });
      } else {
        const product = await tx.product.update({
          where: { id: productId },
          data: { stockCount: { increment: quantity } },
        });

        await tx.inventoryLog.create({
          data: {
            productId,
            action: 'reservation_release',
            quantity,
            previousStock: product.stockCount - quantity,
            newStock: product.stockCount,
            reference,
          },
        });
      }

      return { success: true };
    });
  }

  async getInventoryLogs(productId: string, page = 1, pageSize = 50) {
    const [logs, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.inventoryLog.count({ where: { productId } }),
    ]);

    return { data: logs, total, page, pageSize };
  }

  async getLowStockProducts(threshold = 10) {
    return this.prisma.product.findMany({
      where: {
        status: 'active',
        stockCount: { lte: threshold },
      },
      include: {
        seller: { select: { id: true, businessName: true } },
      },
      orderBy: { stockCount: 'asc' },
    });
  }
}
