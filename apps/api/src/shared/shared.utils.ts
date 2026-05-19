import {
	IErrorResponse,
	IThrowError,
	TModules,
	TFilterErrorKeys,
} from './shared.types';
import { ENTERTAIN_ERRORS, STATUS_HITS } from './shared.constants';
export const getFunError = (
	moduleKey: TModules,
	errorTypeKey: TFilterErrorKeys,
	status: number,
	throwErrorResponse: Partial<IThrowError>,
): IErrorResponse => {
	const funFacts = ENTERTAIN_ERRORS[moduleKey]?.[errorTypeKey] ?? [
		'Even Goku takes a break sometimes...',
	];

	const funFact =
		funFacts[Math.floor(Math.random() * funFacts.length)] ??
		'No fun fact this time — plot twist!';

	const statusHit =
		STATUS_HITS[status]?.[moduleKey] ?? STATUS_HITS[500]['characters'];

	return {
		message: throwErrorResponse.message ?? 'Something went sideways...',
		error: throwErrorResponse.error ?? 'Unknown error',
		hit: statusHit,
		funFact,
		timestamp: throwErrorResponse.timestamp || new Date(),
	};
};
