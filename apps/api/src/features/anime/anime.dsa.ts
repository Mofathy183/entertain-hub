import {
	MoodEnum,
	OrderBy,
	SortOrderEnum,
	type AnimeDocument,
	type QuoteDocument,
} from '@anime';
import { SortBuilder } from '@core';

/**
 * A specialized insertion sort implementation for Anime documents.
 * Provides domain-specific sorting strategies (title, protagonist, rating).
 */
export class AnimeInsertionSort extends SortBuilder<AnimeDocument> {
	/**
	 * A registry of available sorting strategies for Anime fields.
	 */
	public readonly sortingBy: Map<
		OrderBy,
		(order: SortOrderEnum) => AnimeDocument[]
	> = new Map();

	constructor(public readonly animeList: AnimeDocument[]) {
		super(animeList);

		// Register sorting strategies dynamically
		this.sortingBy.set('title', (order) => this.sortingByTitle(order));
		this.sortingBy.set('protagonist', (order) =>
			this.sortingByProtagonist(order),
		);
		this.sortingBy.set('rating', (order) => this.sortingByRating(order));
	}

	/**
	 * Executes a specific sorting strategy based on the `by` field.
	 *
	 * @param by - The field to sort by (e.g., "title", "rating", "protagonist")
	 * @param order - ASC or DESC
	 * @returns A sorted array of Anime documents
	 * @throws If no sorting strategy is registered for the given field
	 */
	public sort(by: OrderBy, order: SortOrderEnum): AnimeDocument[] {
		const sortFn = this.sortingBy.get(by);
		if (!sortFn) throw new Error(`No sorting strategy found for "${by}"`);
		return sortFn(order);
	}

	/**
	 * Sorts anime by `title` alphabetically.
	 */
	private sortingByTitle(order: SortOrderEnum): AnimeDocument[] {
		return this.sortBuilder(
			(a, b) =>
				a.title.localeCompare(b.title, undefined, {
					sensitivity: 'base',
				}),
			order,
		);
	}

	/**
	 * Sorts anime by `protagonist` alphabetically.
	 */
	private sortingByProtagonist(order: SortOrderEnum): AnimeDocument[] {
		return this.sortBuilder(
			(a, b) =>
				a.protagonist.localeCompare(b.protagonist, undefined, {
					sensitivity: 'base',
				}),
			order,
		);
	}

	/**
	 * Sorts anime by `rating` numerically.
	 */
	private sortingByRating(order: SortOrderEnum): AnimeDocument[] {
		return this.sortBuilder((a, b) => a.rating - b.rating, order);
	}
}

/**
 * A specialized insertion sort implementation for Quote documents.
 * Provides sorting by character only (quotes are character-centric).
 */
export class QuoteInsertionSort extends SortBuilder<QuoteDocument> {
	constructor(public readonly quotes: QuoteDocument[]) {
		super(quotes);
	}

	/**
	 * Sorts quotes by character name alphabetically.
	 *
	 * @param order - ASC or DESC
	 */
	public sort(order: SortOrderEnum): QuoteDocument[] {
		return this.sortingByCharacter(order);
	}

	private sortingByCharacter(order: SortOrderEnum): QuoteDocument[] {
		return this.sortBuilder(
			(a, b) =>
				a.character.localeCompare(b.character, undefined, {
					sensitivity: 'base',
				}),
			order,
		);
	}
}

export class FilterAnime {
	//* for to now Duplicate the same quote again in the array
	public seen: Set<string> = new Set();
	//* start the filtering process
	public filteredAnime: AnimeDocument[];

	//* constructor that take the anime array
	constructor(private animeList: AnimeDocument[]) {
		//* initialize the filteredAnime with all anime
		this.filteredAnime = [...animeList];
	}

	byTitle(title?: string): FilterAnime {
		//? check if the title is provided
		if (!title) return this;

		//* start the filtering process
		//* filter the anime based on the title and update the animeList array with new filtered anime
		this.animeList = this.animeList.filter((anime: AnimeDocument) =>
			title
				? //? check if the title include the query, or it exactly matches
					anime.title.toLowerCase() === title.toLowerCase() ||
					anime.title.toLowerCase().includes(title.toLowerCase())
				: //? if no title provided return false
					false,
		);

		return this;
	}

	byProtagonist(protagonist?: string): FilterAnime {
		//? check if the protagonist is provided
		if (!protagonist) return this;

		//* start the filtering process
		//* filter the anime based on the title and update the animeList array with new filtered anime
		this.animeList = this.animeList.filter((anime: AnimeDocument) =>
			protagonist
				? //? check if the protagonist include the query, or it exactly matches
					anime.protagonist.toLowerCase() ===
						protagonist.toLowerCase() ||
					anime.protagonist
						.toLowerCase()
						.includes(protagonist.toLowerCase())
				: //? if no protagonist provided return false
					false,
		);

		return this;
	}

	byUniverse(universe?: string): FilterAnime {
		//? check if the universe is provided
		if (!universe) return this;

		//* start the filtering process
		//* filter the anime based on the title and update the animeList array with new filtered anime
		this.animeList = this.animeList.filter((anime: AnimeDocument) => {
			//? check if the anime have universe because it's optional field
			if (!anime.universe) return false;

			return universe
				? //? check if the universe include the query, or it exactly matches
					anime.universe.toLowerCase() === universe.toLowerCase() ||
						anime.universe
							.toLowerCase()
							.includes(universe.toLowerCase())
				: //? if no universe provided return false
					false;
		});

		return this;
	}

	apply(): AnimeDocument[] {
		//* make the final filtering to remove duplicate anime
		//* return the filtered anime
		return this.filteredAnime.filter((anime: AnimeDocument) =>
			this.seen.has(anime._id) ? false : this.seen.add(anime._id) && true,
		);
	}
}

export class FilterQuote {
	//* for to now Duplicate the same quote again in the array
	public seen: Set<string> = new Set();
	//* start the filtering process
	public filteredQuotes: QuoteDocument[];

	//* constructor that take the quotes array
	constructor(quotes: QuoteDocument[]) {
		//* initialize the filteredQuotes with all quotes
		this.filteredQuotes = [...quotes];
	}

	byCharacter(character?: string): FilterQuote {
		//? check if the character is provided
		if (!character) return this;

		//* start the filtering process
		//* filter the quotes based on the character and update the filteredQuotes array with new filtered quotes
		this.filteredQuotes = this.filteredQuotes.filter(
			(quote: QuoteDocument) =>
				character
					? //? check if the character include the query, or it exactly matches
						quote.character
							.toLowerCase()
							.includes(character.toLowerCase()) ||
						quote.character.toLowerCase() ===
							character.toLowerCase()
					: //? if no character provided return false
						false,
		);

		return this;
	}

	byMood(mood?: MoodEnum): FilterQuote {
		//? check if the mood is provided
		if (!mood) return this;

		//* start the filtering process
		//* filter the quotes based on the mood and update the filteredQuotes array with new filtered quotes
		this.filteredQuotes = this.filteredQuotes.filter(
			//* compare the mood in a case-insensitive way
			(quote: QuoteDocument) =>
				mood
					? quote.mood.toString().toUpperCase() ===
						mood.toString().toUpperCase()
					: false,
		);

		return this;
	}

	byWord(word?: string): FilterQuote {
		//? check if the word is provided
		if (!word) return this;

		//* start the filtering process
		//* filter the quotes based on the word and update the filteredQuotes array with new filtered quotes
		this.filteredQuotes = this.filteredQuotes.filter(
			//* check if the quote include the word in a case-insensitive way
			(quote: QuoteDocument) =>
				word
					? quote.quote.toLowerCase().includes(word.toLowerCase())
					: false,
		);

		return this;
	}

	apply(): QuoteDocument[] {
		//* make the final filtering to remove duplicate quotes
		//* return the final quotes
		return this.filteredQuotes.filter((quote: QuoteDocument) =>
			this.seen.has(quote._id) ? false : this.seen.add(quote._id) && true,
		);
	}
}
