import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from 'src/student/student.module';
import { Lesson } from './lesson.entity';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';
import { LessonsRepository } from './lessons.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LessonsRepository]), StudentModule],
  providers: [LessonResolver, LessonService],
})
export class LessonModule {}
