import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './manager/manager.controller';
import { ManagerModule } from './manager/manager.module';
import { SellerController } from './seller/seller.controller';
import { SellerModule } from './seller/seller.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      "type": "postgres",
      "host": "localhost",
      "port": 5432,
      "username": "postgres",
      "password": "postgres",
      "database": "ADWT",
      autoLoadEntities: true,
      "synchronize": true
    }
  ), ManagerModule, SellerModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
