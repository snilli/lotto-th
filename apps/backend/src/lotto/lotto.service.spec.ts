import { Test, TestingModule } from '@nestjs/testing';
import { MooService } from './moo.service';

describe('MooService', () => {
  let service: MooService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MooService],
    }).compile();

    service = module.get<MooService>(MooService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
