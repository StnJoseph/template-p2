import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CountriesModule } from './countries/countries.module';
import { TravelPlansModule } from './travel-plans/travel-plans.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: process.env.DB_HOST,
      // port: +process.env.DB_PORT!,
      database: 'travel-planner.db',        // Nombre de la base de datos SQLite
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      // autoLoadEntities: true,
      synchronize: true, // SOLO EN DESARROLLO
      logging: true, // Habilita el registro de consultas SQL
    }),
    HttpModule,
    CountriesModule,
    TravelPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
