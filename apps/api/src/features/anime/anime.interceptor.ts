import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
import { HashMapKey, LRUCache, type IAnime, type IQuote } from '@anime';

@Injectable()
export class AnimeInterceptor implements NestInterceptor {
	//* Persistent LRUCache instance for the interceptor (shared across requests)
	private lruCache = new LRUCache<
		string,
		IAnime | IAnime[] | IQuote | IQuote[]
	>();

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>();
		const res = context.switchToHttp().getResponse<Response>();
		const { method, url } = req;

		//* Skip caching for non-GET or /random endpoints
		if (method !== 'GET' || /random/.test(url)) return next.handle();

		//* Generate a unique Hash map cache key
		const hashKey: string = new HashMapKey(method, url).key;

		//? check if the key exists in the cache
		const cachedData = this.lruCache.get(hashKey);
		if (cachedData) {
			res.setHeader('X-Cache', 'HIT');
			//* return cached response immediately
			return of(cachedData);
		}

		return next.handle().pipe(
			tap((responseData: IAnime | IAnime[] | IQuote | IQuote[]) => {
				//* store response in cache (move to head internally)
				this.lruCache.put(hashKey, responseData);
				res.setHeader('X-Cache', 'MISS');
			}),
		);
	}
}
