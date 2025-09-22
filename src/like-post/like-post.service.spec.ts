import { Test, TestingModule } from '@nestjs/testing';
import { LikePostService } from './like-post.service';

describe('LikePostService', () => {
  let service: LikePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikePostService],
    }).compile();

    service = module.get<LikePostService>(LikePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
