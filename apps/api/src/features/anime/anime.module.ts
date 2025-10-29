import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import {
	Anime,
	AnimeSchema,
	Quote,
	QuoteSchema,
	AnimeController,
	AnimeService,
	AnimeValidationFilter,
} from '@anime';

@Module({
	//* will add the module imports here
	imports: [
		MongooseModule.forFeature([
			{ name: Anime.name, schema: AnimeSchema },
			{ name: Quote.name, schema: QuoteSchema },
		]),
	],
	//* will add the module controller here
	controllers: [AnimeController],
	//* will add the module service here
	providers: [
		AnimeService,
		{
			provide: APP_FILTER,
			useClass: AnimeValidationFilter,
		},
	],
	exports: [MongooseModule, AnimeService],
})
export class AnimeModule {}
