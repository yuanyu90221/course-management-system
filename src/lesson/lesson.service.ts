import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';
import { LessonsRepository } from './lessons.repository';
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonsRepository)
    private lessonRepository: LessonsRepository,
  ) {}
  async getLesson(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ id });
    if (!lesson) {
      throw new NotFoundException(`lesson with id: ${id} not found`);
    }
    return lesson;
  }
  async getLessons(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }
  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    return this.lessonRepository.createLesson(createLessonInput);
  }
  async assignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    return this.lessonRepository.assignStudentsToLesson(lessonId, studentIds);
  }
}
