import { Test } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { LessonsRepository } from './lessons.repository';
import { v4 as uuid } from 'uuid';
import { ConflictException, NotFoundException } from '@nestjs/common';
const mockLessonsRepository = () => ({
  createLesson: jest.fn(),
  assignStudentsToLesson: jest.fn(),
  findOne: jest.fn(),
});
describe('LessonService', () => {
  let lessonService: LessonService;
  let lessonsRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LessonService,
        { provide: LessonsRepository, useFactory: mockLessonsRepository },
      ],
    }).compile();
    lessonService = module.get<LessonService>(LessonService);
    lessonsRepository = module.get<LessonsRepository>(LessonsRepository);
  });
  describe('createLesson', () => {
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 30);
    const mockCreateLessonInput = {
      name: 'mock Class Name',
      startDate: currentDate.toISOString(),
      endDate: endDate.toISOString(),
      students: [],
    };
    it('call LessonsRepository.createLesson once', async () => {
      await lessonService.createLesson(mockCreateLessonInput);
      expect(lessonsRepository.createLesson).toHaveBeenCalled();
    });
    it('call LessonsRepository.createLesson and return a Lesson', async () => {
      const mockLessonResponse = {
        ...mockCreateLessonInput,
        id: uuid(),
      };
      lessonsRepository.createLesson.mockResolvedValue(mockLessonResponse);
      const result = await lessonService.createLesson(mockCreateLessonInput);
      expect(result).toEqual(mockLessonResponse);
    });
  });
  describe('getLesson', () => {
    const mockLessonId = uuid();
    it('call LessonsRepository.findOne and return Lesson', async () => {
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setMinutes(endDate.getMinutes() + 30);
      const mockLessonResponse = {
        id: mockLessonId,
        name: 'mockLessonName',
        startDate: currentDate.toISOString(),
        endDate: endDate.toISOString(),
        students: [],
      };
      lessonsRepository.findOne.mockResolvedValue(mockLessonResponse);
      const result = await lessonService.getLesson(mockLessonId);
      expect(result).toEqual(mockLessonResponse);
    });
    it('call LessonsRepository.findOne and not found matched Lesson', async () => {
      lessonsRepository.findOne.mockResolvedValue(null);
      try {
        await expect(lessonService.getLesson(mockLessonId)).rejects.toThrow(
          NotFoundException,
        );
      } catch (error) {
        throw error;
      }
    });
  });
  describe('assignStudentsToLesson', () => {
    it('call LessonsRepository.assignStudentsToLesson and return a Lesson', async () => {
      const mockLessonId = uuid();
      const mockStudentIds = [uuid(), uuid()];
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setMinutes(endDate.getMinutes() + 30);
      const mockLessonResponse = {
        id: mockLessonId,
        name: 'mock Lesson Response name',
        startDate: currentDate.toISOString(),
        endDate: endDate.toISOString(),
        students: [...mockStudentIds],
      };
      lessonsRepository.assignStudentsToLesson.mockResolvedValue(
        mockLessonResponse,
      );
      const result = await lessonService.assignStudentsToLesson(
        mockLessonId,
        mockStudentIds,
      );
      expect(result).toEqual(mockLessonResponse);
    });
  });
});
