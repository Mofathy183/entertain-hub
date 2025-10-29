import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Anime, AnimeDocument, Quote, QuoteDocument } from '@anime';
import { animeDB } from '@seed';

@Injectable()
export class AnimeSeeder implements Seeder {
	constructor(
		@InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
		@InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
	) {}

	async seed(): Promise<any> {
		// Clean collections
		await this.animeModel.deleteMany({});
		await this.quoteModel.deleteMany({});

		for (const anime of animeDB) {
			// 1. Create the anime
			const createdAnime = await this.animeModel.create({
				title: anime.title,
				protagonist: anime.protagonist,
				universe: anime.universe,
				rating: anime.rating,
			});

			// 2. Create related quotes with animeId
			const createdQuotes = await this.quoteModel.insertMany(
				anime.quotes?.map((q) => ({
					...q,
					animeId: createdAnime._id,
				})) ?? [],
			);

			// 3. Link quotes to anime
			await this.animeModel.updateOne(
				{ _id: createdAnime._id },
				{ $set: { quotes: createdQuotes.map((q) => q._id) } }, // store only IDs for normalization
			);
		}

		console.log('✅=== Seed Anime + Quotes Successfully ===✅');
	}

	async drop(): Promise<any> {
		await this.animeModel.deleteMany({});
		await this.quoteModel.deleteMany({});
		console.log('🗑️=== Dropped Anime + Quotes ===🗑️');
	}
}
