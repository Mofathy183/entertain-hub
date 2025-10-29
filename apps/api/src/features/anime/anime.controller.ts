import {
	Controller,
	Get,
	Param,
	Query,
	Body,
	ParseIntPipe,
	ParseEnumPipe,
	DefaultValuePipe,
	Post,
	Patch,
	Delete,
	UseInterceptors,
} from '@nestjs/common';
import {
	type IAnime,
	type IQuote,
	type IUpdateQuote,
	type IDelete,
	type IUpdateAnime,
	type OrderBy,
	UpdateAnimeDto,
	AnimeInterceptor,
	CreateAnimeDto,
	CreateQuoteDto,
	UpdateQuoteDto,
	AnimeService,
	AnimeMapper,
	TreeNode,
	MoodEnum,
	SortOrderEnum,
} from '@anime';
import { CuidValidationPipe } from '@core';

//* the route endpoint for this controller
@UseInterceptors(AnimeInterceptor)
@Controller('anime') //* so any request to "/anime" will be handled by this controller
export class AnimeController {
	/**
	 * Constructor to inject the AnimeService
	 * @param animeService The AnimeService instance
	 *
	 * @Injectable() is a decorator that marks a class as a provider that can be injected as a dependency.
	 * In this case, it allows the AnimeService to be injected into the AnimeController.
	 *
	 * The AnimeService is responsible for handling the business logic related to anime and quotes,
	 * while the AnimeController handles incoming HTTP requests and delegates the work to the service.
	 *
	 * This separation of concerns helps keep the code organized and maintainable.
	 */
	//* will add the controller methods here

	//* injecting the AnimeService into the controller
	constructor(private readonly animeService: AnimeService) {}

	//* GET "/anime" get all amine with its quotes. PARAMS limit for the amine default 10, and quotes per anime default 5
	@Get()
	async fineAllAnime(
		@Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IAnime[]> {
		const animes = this.animeService.getAllAnime(limit, quotes);
		return (await animes).map((anime) => AnimeMapper.toAnimeDTO(anime));
	}

	//* GET "/anime/search" get anime by QUERY title, protagonist, universe. these are the query we will search for in the anime
	@Get('search')
	async fineAnimeBySearch(
		@Query('title') title?: string,
		@Query('protagonist') protagonist?: string,
		@Query('universe') universe?: string,
	): Promise<IAnime[] | undefined> {
		//? if no query params provided, return empty array
		if (!title && !protagonist && !universe) return [];

		const animes = await this.animeService.animeSearch(
			title,
			protagonist,
			universe,
		);
		return animes.map((anime) => AnimeMapper.toAnimeDTO(anime));
	}

	//* GET "/anime/random" Get a random anime with its quotes, quotes per anime default 5
	@Get('random')
	async fineRandomAnime(
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IAnime> {
		const anime = await this.animeService.getRandomAnime(quotes);
		return AnimeMapper.toAnimeDTO(anime);
	}

	//* Get "anime/sort" It sort the anime by QUERY title, protagonist, rating. and it use insertion sort to make the sort
	@Get('sort')
	async findSortedAnime(
		@Query('by') by: OrderBy,
		@Query(
			'order',
			new DefaultValuePipe(SortOrderEnum.ASC),
			new ParseEnumPipe(SortOrderEnum),
		)
		order: SortOrderEnum,
	): Promise<IAnime[]> {
		const sortedAnime = await this.animeService.sortingAnime(by, order);
		return sortedAnime.map((anime) => AnimeMapper.toAnimeDTO(anime));
	}

	//* GET "/anime/top-10" get top ten anime by rating with its quotes, quotes per anime default 5
	@Get('top-10')
	async fineTopTenAnime(): Promise<TreeNode> {
		const animes = await this.animeService.getTop10Anime();
		return animes;
	}

	//* GET "/anime/:id" get anime by id will its quotes. quotes per anime default 5
	@Get(':id')
	async findAnimeById(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IAnime> {
		const anime = await this.animeService.getAnimeById(id, quotes);
		return AnimeMapper.toAnimeDTO(anime);
	}

	//* GET "/anime/quote/search" get quote by QUERY word, character, mood, these are the query we will search for in the quote
	@Get('quote/search')
	async fineQuoteBySearch(
		@Query('word') word?: string,
		@Query('character') character?: string,
		@Query('mood', new ParseEnumPipe(MoodEnum, { optional: true }))
		mood?: MoodEnum,
	): Promise<IQuote[] | undefined> {
		//? if no query params provided, return empty array
		if (!word && !character && !mood) return [];

		const quotes = await this.animeService.quoteSearch(
			word,
			character,
			mood,
		);
		return quotes.map((quote) => AnimeMapper.toQuoteDTO(quote));
	}

	//* GET "/anime/quote/sort" get sorted list by character, the QUERY "by" will take either of ASC or DESC
	@Get('quote/sort')
	async findSortedQuote(
		@Query(
			'order',
			new DefaultValuePipe(SortOrderEnum.ASC),
			new ParseEnumPipe(SortOrderEnum),
		)
		order: SortOrderEnum,
	): Promise<IQuote[]> {
		const sortedQuotes = await this.animeService.sortingQuote(order);

		return sortedQuotes.map((quote) => AnimeMapper.toQuoteDTO(quote));
	}

	//* GET "/anime/quote/random" Get a random quote
	@Get('quote/random')
	async fineRandomQuote(): Promise<IQuote> {
		const quote = await this.animeService.getRandomQuote();
		return AnimeMapper.toQuoteDTO(quote);
	}

	//* GET "quote/:id" get quote by id
	@Get('quote/:id')
	async findQuotById(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IQuote> {
		const quote = await this.animeService.getQuoteById(id);
		return AnimeMapper.toQuoteDTO(quote);
	}

	//* POST "/anime" create new anime
	@Post()
	async createAnime(@Body() createAnimeDto: CreateAnimeDto): Promise<IAnime> {
		const newAnime = await this.animeService.createAnime(createAnimeDto);
		return AnimeMapper.toAnimeDTO(newAnime);
	}

	//* POST "/anime/:id/quote" create new quote for anime by id
	@Post(':id/quote')
	async createQuot(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() createQuoteDto: CreateQuoteDto,
	): Promise<IQuote> {
		const newQuote = await this.animeService.createQuote(
			id,
			createQuoteDto,
		);
		return AnimeMapper.toQuoteDTO(newQuote);
	}

	//* PATCH "/quote/:id" update quote by id
	@Patch('quote/:id')
	async updateQuot(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() updateQuoteDto: UpdateQuoteDto,
	): Promise<IUpdateQuote> {
		const updatedQuote = await this.animeService.updateQuote(
			id,
			updateQuoteDto,
		);
		return AnimeMapper.toQuoteDTO(updatedQuote);
	}

	//* PATCH "/:id" update anime by id
	@Patch(':id')
	async updateAnime(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() updateAnimeDto: UpdateAnimeDto,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IUpdateAnime> {
		const updatedAnime = await this.animeService.updateAnime(
			id,
			updateAnimeDto,
			quotes,
		);
		return AnimeMapper.toAnimeDTO(updatedAnime);
	}

	//* DELETE "/quote/:id" delete quote by id
	@Delete('quote/:id')
	async deleteQuote(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IDelete> {
		const deletedQuote = await this.animeService.deleteQuote(id);
		return AnimeMapper.toDelete(id, deletedQuote);
	}

	//* DELETE "/:id" delete anime by id
	@Delete(':id')
	async deleteAnime(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IDelete> {
		const deleteAnime = await this.animeService.deleteAnime(id);
		return AnimeMapper.toDelete(id, deleteAnime);
	}
}
