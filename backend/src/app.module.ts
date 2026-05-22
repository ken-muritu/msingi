import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { SearchModule } from './modules/search/search.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { CartModule } from './modules/cart/cart.module';
import { StorageModule } from './modules/storage/storage.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      { name: 'short',  ttl: 1000,  limit: 10  },
      { name: 'medium', ttl: 10000, limit: 50  },
      { name: 'long',   ttl: 60000, limit: 200 },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
    OrdersModule,
    PaymentsModule,
    SellersModule,
    SearchModule,
    ReviewsModule,
    NotificationsModule,
    CartModule,
    StorageModule,
    AnalyticsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
