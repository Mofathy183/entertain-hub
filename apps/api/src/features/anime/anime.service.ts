import { Injectable } from '@nestjs/common';
import { Model, DeleteResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FisherYatesShuffle, BinaryTree, TreeNode } from '@shared';
import {
	CreateAnimeDto,
	CreateQuoteDto,
	UpdateQuoteDto,
	UpdateAnimeDto,
	MoodEnum,
	FilterQuote,
	FilterAnime,
	AnimeThrowError,
	Anime,
	Quote,
	AnimeDocument,
	QuoteDocument,
	OrderBy,
	SortOrderEnum,
	AnimeInsertionSort,
	QuoteInsertionSort,
} from '@anime';

@Injectable()
export class AnimeService {
	private animeShuffle?: FisherYatesShuffle<AnimeDocument>;
	private quoteShuffle?: FisherYatesShuffle<QuoteDocument>;

	constructor(
		@InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
		@InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
	) {}

	//* will add the service methods here

	async getAllAnime(limit: number, quotes: number): Promise<AnimeDocument[]> {
		try {
			//* first get the anime list from the db with the limit
			const animeList = await this.animeModel
				.find()
				.limit(limit)
				//* secondly map through the anime list and limit the quotes per anime
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			if (!animeList || animeList.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound').throwError();
				return [];
			}

			return animeList;
		} catch (error: unknown) {
			// if it's a cast error (invalid ObjectId, etc.)
			new AnimeThrowError(
				'findAll',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async getRandomAnime(quotes: number): Promise<AnimeDocument> {
		try {
			if (this.animeShuffle) {
				const randomAnime = this.animeShuffle.pickOne();

				//* limit the quotes per anime
				randomAnime.quotes = randomAnime.quotes
					? randomAnime.quotes.slice(0, quotes)
					: [];
				return randomAnime;
			}

			//* first get all anime list from the db
			const animeList = await this.animeModel
				.find()
				.populate({ path: 'quotes', options: { limit: quotes } });

			if (!animeList || animeList.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			//* shuffle the anime list
			//* return the next random anime
			this.animeShuffle = new FisherYatesShuffle<AnimeDocument>(
				animeList,
			);

			return this.animeShuffle.pickOne();
		} catch (error: unknown) {
			new AnimeThrowError(
				'findAll',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async getAnimeById(id: string, quotes: number = 5): Promise<AnimeDocument> {
		try {
			//* find the anime by id
			const anime = await this.animeModel
				.findOne({ _id: id })
				//* the anime has quotes, slice them with the quotes limit
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			//* if not found, throw error
			if (!anime) {
				new AnimeThrowError(
					'notFound',
					'anime',
					'notFound',
				).throwError();
				return undefined as never;
			}

			return anime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async animeSearch(
		title?: string,
		protagonist?: string,
		universe?: string,
	): Promise<AnimeDocument[]> {
		try {
			const animeList = await this.animeModel.find();

			return (
				new FilterAnime(animeList)
					.byTitle(title)
					.byProtagonist(protagonist)
					.byUniverse(universe)
					.apply() ?? []
			);
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async sortingAnime(
		by: OrderBy,
		order: SortOrderEnum,
	): Promise<AnimeDocument[]> {
		try {
			//* fetch the data from the DB
			const animeList = await this.animeModel.find();

			//* use the AnimeInsertionSort to sort based on the "by" that will get from the Query and the Query "order" too
			const sortedList = new AnimeInsertionSort(animeList).sort(
				by,
				order,
			);

			//? check if the list is not empty
			if (!sortedList || sortedList.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound');
				return [];
			}

			//* return the sorted list
			return sortedList;
		} catch (error: unknown) {
			new AnimeThrowError(
				'empty',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async getTop10Anime(): Promise<TreeNode> {
		try {
			const animeList = await this.animeModel.find();

			//* sort in memory using insertion sort
			//* Sort it DESC will make it from the bigger => smaller
			const sorted = new AnimeInsertionSort(animeList).sort(
				'rating',
				SortOrderEnum.DESC,
			);

			//? check if the list is not empty
			if (!sorted || sorted.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound');
				return undefined as never;
			}

			//* take top 10
			const top10 = sorted.slice(0, 10);

			//* build your binary tree root and return
			return new BinaryTree(top10).getTreeRoot();
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async quoteSearch(
		word?: string,
		character?: string,
		mood?: MoodEnum,
	): Promise<QuoteDocument[]> {
		try {
			const quotes = await this.quoteModel.find();

			return (
				new FilterQuote(quotes)
					.byCharacter(character)
					.byMood(mood)
					.byWord(word)
					.apply() ?? []
			);
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async sortingQuote(order: SortOrderEnum): Promise<QuoteDocument[]> {
		try {
			//* fetch all the quotes from the DB
			const quotes = await this.quoteModel.find();

			const sortedList = new QuoteInsertionSort(quotes).sort(order);

			//? check if the list is not empty
			if (!sortedList || sortedList.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound');
				return [];
			}

			return sortedList;
		} catch (error: unknown) {
			new AnimeThrowError(
				'empty',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async getRandomQuote(): Promise<QuoteDocument> {
		try {
			if (this.quoteShuffle) {
				return this.quoteShuffle.pickOne();
			}

			//* first get all quotes from the db
			const quoteList = await this.quoteModel.find();

			if (!quoteList || quoteList.length === 0) {
				new AnimeThrowError('empty', 'quote', 'notFound').throwError();
				return undefined as never;
			}

			//* shuffle the quote list
			//* return the next random quote
			this.quoteShuffle = new FisherYatesShuffle<QuoteDocument>(
				quoteList,
			);

			return this.quoteShuffle.pickOne();
		} catch (error: unknown) {
			new AnimeThrowError(
				'findAll',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async getQuoteById(id: string): Promise<QuoteDocument> {
		try {
			//* first get the anime by id
			const quote = await this.quoteModel.findOne({ _id: id });

			//* if not found, throw error
			if (!quote) {
				new AnimeThrowError(
					'notFound',
					'quote',
					'notFound',
				).throwError();
				return undefined as never;
			}

			return quote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async createAnime(createAnimeDto: CreateAnimeDto): Promise<AnimeDocument> {
		try {
			//* create new anime object
			const newAnime = await this.animeModel.create({
				title: createAnimeDto.title,
				protagonist: createAnimeDto.protagonist,
				universe: createAnimeDto.universe,
				rating: createAnimeDto.rating,
			});

			if (!newAnime) {
				new AnimeThrowError('create', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return newAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'create',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async createQuote(
		animeId: string,
		createQuoteDto: CreateQuoteDto,
	): Promise<QuoteDocument> {
		try {
			//* first get the anime by id
			//* create new quote object
			const newQuote = await this.quoteModel.create({
				animeId: animeId,
				character: createQuoteDto.character,
				quote: createQuoteDto.quote,
				mood: createQuoteDto.mood,
			});

			//* add the new quote to the anime quotes
			await this.animeModel.updateOne(
				{ _id: animeId },
				{ $push: { quotes: newQuote._id } },
			);

			if (!newQuote) {
				new AnimeThrowError('create', 'quote', 'notFound').throwError();
				return undefined as never;
			}

			return newQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'create',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async updateQuote(
		id: string,
		updateQuoteDto: UpdateQuoteDto,
	): Promise<QuoteDocument> {
		try {
			//* first get the quote by id
			const updatedQuote = await this.quoteModel.findByIdAndUpdate(
				//? if the anime has quotes, find the quote by id and update it
				id,
				//* update the quote object with the new values
				// if the quote is found, update it
				{
					character: updateQuoteDto?.character,
					quote: updateQuoteDto?.quote,
					mood: updateQuoteDto?.mood,
				},
				{ new: true },
			);

			//? if the quote is not found, throw error
			if (!updatedQuote) {
				new AnimeThrowError('update', 'quote', 'notFound').throwError();
				return undefined as never;
			}

			return updatedQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'update',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async updateAnime(
		id: string,
		updateAnimeDto: UpdateAnimeDto,
		quotes: number,
	): Promise<AnimeDocument> {
		try {
			//* check if the anime is in the DB first
			if (updateAnimeDto.title) {
				const exists = await this.animeModel
					.findOne({ title: updateAnimeDto.title })
					.collation({ locale: 'en', strength: 2 });

				if (exists) {
					new AnimeThrowError(
						'update',
						'anime',
						'conflict',
						`Anime with title "${updateAnimeDto.title}" already exists. Choose another epic name!`,
					).throwError();
					return undefined as never;
				}
			}

			const updatedAnime = await this.animeModel
				.findByIdAndUpdate(
					id,
					{
						title: updateAnimeDto?.title,
						protagonist: updateAnimeDto?.protagonist,
						universe: updateAnimeDto?.universe,
						rating: updateAnimeDto.rating,
					},
					{ new: true },
				)
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			//? if there is a not found throw error
			if (!updatedAnime) {
				new AnimeThrowError('update', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return updatedAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'update',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async deleteAnime(id: string): Promise<DeleteResult> {
		try {
			const deletedAnime = await this.animeModel.deleteOne({ _id: id });

			if (!deletedAnime) {
				new AnimeThrowError('delete', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return deletedAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'delete',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async deleteQuote(id: string): Promise<DeleteResult> {
		try {
			//* first get the quote by id
			const deletedQuote = await this.quoteModel.deleteOne({ _id: id });

			if (!deletedQuote) {
				new AnimeThrowError('delete', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			//* return DeleteResult
			return deletedQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'delete',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}
}
