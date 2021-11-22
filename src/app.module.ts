import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.shema';
import { Lesson } from './lesson/lesson.entity';
import { LessonModule } from './lesson/lesson.module';
import { Student } from './student/student.entity';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          synchronize: true,
          useUnifiedTopology: true,
          entities: [Lesson, Student],
          host: configService.get('DB_HOST'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          port: configService.get('DB_PORT'),
          authSource: configService.get('DB_AUTHSOURCE'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    LessonModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    StudentModule,
  ],
})
export class AppModule {}
