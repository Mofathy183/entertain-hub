import { ValidationError } from 'class-validator';

interface IFilterError {
	routes: string[]; // unmatched routes
	notFound: string[]; // not found error
	InternalServer: string[]; //  unexpected internal errors
	unknown: string[]; // Fallback for truly unknown exceptions
	conflict?: string[];
	forbidden?: string[];
	unauthorized?: string[];
}

type TStatusHits = {
	message: string;
	status: string;
};

//* that all the category that cover by the error messages and status hits
export interface ModuleRelations {
	anime: 'anime' | 'quote';
	movies: 'movies' | 'characters';
	songs: 'songs';
	series: 'series' | 'characters';
	books: 'books' | 'quote' | 'characters';
	characters: 'characters';
}

export type TModules = keyof ModuleRelations;

export type ModuleCategory<M extends TModules> = ModuleRelations[M];

//* that all the category of the errors that have error massages
export type TFilterErrorKeys = keyof IFilterError;

export interface IErrorMessage<M extends TModules> {
	notFound: Record<ModuleCategory<M>, string[]>;
	empty: Record<ModuleCategory<M>, string[]>;
	create: Record<ModuleCategory<M>, string[]>;
	update: Record<ModuleCategory<M>, string[]>;
	delete: Record<ModuleCategory<M>, string[]>;
	findAll?: Record<ModuleCategory<M>, string[]>;
}

type TStatusHitsByCategory = Record<TModules, TStatusHits[]>;

export type TStatusHitsMap = Record<number, TStatusHitsByCategory>;
export type TFilterMap = Record<TModules, IFilterError>;

export interface IThrowError {
	message: string;
	error: string | object;
	errorType: TFilterErrorKeys;
	module: TModules;
	timestamp: Date;
}

export interface IErrorResponse
	extends Omit<IThrowError, 'errorType' | 'module'> {
	hit: TStatusHits[];
	funFact: string;
}

export type TValidationDetails = {
	field: string;
	errors: string[];
	suggestion: string;
};

export interface IValidationResponse {
	message: string;
	details: TValidationDetails[];
}

export interface ValidationExceptionResponse {
	message: string | string[];
	errors?: ValidationError[];
}
