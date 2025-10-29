import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimeModule } from '@anime';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MongoDB_URL'),
			}),
		}),
		AnimeModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

/**
 * so do i make it like that
 * git commit -m "
    *  ✨ feat(api): add core module & enhance anime features with DSA-powered endpoints

    # 🧱 Core Module (@core)
    - Added `src/core` folder to contain app-wide NestJS layers (`filters`, `middlewares`, `pipes`, `utilities`)
    - Implemented base abstract classes for error handling & validation
    - Added `AppExceptionsFilter` for unified global error catching
    - Created `CuidValidationPipe` for param validation
    - Added shared utilities & types exported via `@core` path alias

    # 🎬 Anime Module (@anime)
    - Added multiple new endpoints:
    • `GET /anime/search` — linear search by title, protagonist, universe  
    • `GET /anime/random` — random anime (Fisher-Yates shuffle)  
    • `GET /anime/sort` — insertion sort by title, protagonist, or rating  
    • `GET /anime/top-10` — top 10 anime using binary tree structure  
    • `GET /anime/quote/search` — linear search by word, character, mood  
    • `GET /anime/quote/sort` — insertion sort (ASC/DESC) by character  
    • `GET /anime/quote/random` — random quote using Fisher-Yates shuffle
    - Added new `anime.dsa.ts` for all DSA/algorithm logic (insertion sort, shuffle, binary tree, etc.)
    - Added caching interceptor using **LRU Cache** strategy built with **Doubly Linked List + HashMap**
    - Extended Anime schema with `rating`, removed `powerLevel` from quotes
    - Added `@seed` path alias for seeding utilities

    # 🧠 Highlights
    - Strong modular structure for better scalability
    - Efficient DSA-based query, sort, and cache systems
    - Type-safe and maintainable architecture across modules
 * "
    --edit "
    ✨ feat(api): add core module & anime DSA endpoints with caching and utilities
    🔧 Scope: apps/api
    🏗️ Structure: Introduced @core module, refactored @anime with advanced DSA logic
    🧠 Algorithms: Linear Search, Insertion Sort, Fisher-Yates Shuffle, Binary Tree, LRU Cache
    🧩 Integration: Added TS path aliases for @core, @anime, and @seed
    "
 */
