import { Test, TestingModule } from '@nestjs/testing';
import { AnimeSeeder } from './seed.service';

describe('AnimeSeeder', () => {
	let service: AnimeSeeder;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AnimeSeeder],
		}).compile();

		service = module.get<AnimeSeeder>(AnimeSeeder);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
