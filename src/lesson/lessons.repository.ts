import { EntityRepository, Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonInput } from './lesson.input';
import { v4 as uuid } from 'uuid';
import { NotFoundException } from '@nestjs/common';
@EntityRepository(Lesson)
export class LessonsRepository extends Repository<Lesson> {
  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    const lesson = this.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });
    return this.save(lesson);
  }
  async assignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.findOne({ id: lessonId });
    if (!lesson) {
      throw new NotFoundException(
        `lesson not found with lessonId: ${lessonId}`,
      );
    }
    lesson.students = [...lesson.students, ...studentIds];
    return this.save(lesson);
  }
}
