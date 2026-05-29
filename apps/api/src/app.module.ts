import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";
import { DatabaseModule } from "./modules/database/database.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { HealthModule } from "./modules/health/health.module";
import { ListingsModule } from "./modules/listings/listings.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { RequestsModule } from "./modules/requests/requests.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ["../../.env", ".env"],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ListingsModule,
    RequestsModule,
    FavoritesModule,
    ConversationsModule,
    NotificationsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
