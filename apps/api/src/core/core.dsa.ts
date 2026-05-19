//* it will create new hash key for cache
export class HashMapKey {
	public readonly key: string;

	constructor(
		private method: string,
		private url: string,
	) {
		this.key = this.createCacheKey();
	}

	createCacheKey(): string {
		//* the format of the key will be like that
		if (this.method.toUpperCase() !== 'GET') return '';

		const [path, query = ''] = this.url.split('?');

		//* if the request is make without query return the key in that format
		//* <HTTP_METHOD>:<URL | URL_WITH_PARAM>
		if (!query) return `${this.method}:${path}`;

		//* is there a query start sort it to make the key constant to make the query always the same by sort it
		const params = new URLSearchParams(query);

		//* that sort all the queries based on the alphabetic sorting
		const sortParam = Array.from(params.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([k, v]) => `${k}=${v}`)
			.join('&');

		//* <HTTP_METHOD>:<URL | URL_WITH_PARAM>?<SORTED_QUERY_PARAMS>
		return `${this.method}:${path}?${sortParam}`;
	}
}

export class DLLNode<K, V> {
	public next: DLLNode<K, V> | null = null;
	public prev: DLLNode<K, V> | null = null;

	constructor(
		public readonly key: K,
		public value: V,
	) {}
}

export class LRUCache<K, V> {
	public capacity: number = 4;
	//* it store the node for O(1) lookup
	private map: Map<K, DLLNode<K, V>> = new Map();
	readonly head: DLLNode<K, V>;
	readonly tail: DLLNode<K, V>;

	constructor() {
		//* the head is an only Pointer not have value
		this.head = new DLLNode<K, V>({} as K, {} as V);
		//* same goes to the tail, is it an only Pointer not have value
		this.tail = new DLLNode<K, V>({} as K, {} as V);
		this.head.next = this.tail;
		this.tail.prev = this.head;
	}

	get(key: K): V | null {
		//* Lookup the node in the map (O(1))
		const node = this.map.get(key);

		//? If not found, cache miss → return null
		if (!node) return null;

		//* Move this node to the head (Most Recently Used)
		this.shift(node);

		/**
		 * Before get("B")
                head <-> [A] <-> [B] <-> [C] <-> tail

		 * After get("B")  //* B is most recently used
                head <-> [B] <-> [A] <-> [C] <-> tail
		 */

		//* Return its value
		return node.value;
	}

	put(key: K, value: V): void {
		//* 1️⃣ Create a new node
		const newNode = new DLLNode<K, V>(key, value);

		//* Delegate to "add" — which handles both insert/update logic
		this.add(newNode);

		return;
	}

	/**
	 * @description
	 * Add a node to the head (most recently used position).
	 * If the key already exists, update its value and move it to the head.
	 */
	add(node: DLLNode<K, V>): void {
		//* Check if the key already exists in the cache
		const existingNode = this.map.get(node.key);

		//? If it exists → update value & move to head
		if (existingNode) {
			existingNode.value = node.value; // update only the value

			//? Detach the node from its current position before shifting
			if (existingNode.prev && existingNode.next) {
				existingNode.prev.next = existingNode.next;
				existingNode.next.prev = existingNode.prev;
			}

			//* Move it to head
			this.shift(existingNode);

			//* Done — maybe evict if full
			this.pop();

			return;
		}

		//? If it doesn't exist → insert new node

		//* Insert new node into map
		this.map.set(node.key, node);

		//* Move new node to head
		this.shift(node);

		//* Evict if capacity exceeded
		this.pop();

		return;
	}

	/**
	 * @description
	 * Move a node to be the most recently used (head position).
	 * - If the node is already somewhere in the list → remove it first.
	 * - Then reattach it right after (next) the head.
	 *
	 * This ensures the doubly linked list (DLL) stays correct:
	 * head <-> most_recently_used <-> ... <-> least_recently_used <-> tail
	 */
	shift(node: DLLNode<K, V>): void {
		//? CASE 1: if the list is empty (head <-> tail only)
		//? that means there are no nodes between head and tail yet
		if (this.head.next === this.tail) {
			//* link head -> node -> tail
			this.head.next = node;
			this.tail.prev = node;

			//* link node to head and tail
			//* head <-> node <-> tail
			node.prev = this.head;
			node.next = this.tail;

			/**
			 *  Diagram:
			 *  ┌──────┐     ┌──────────┐    ┌──────┐
			 *  │ head │───▶│   node   │───▶│ tail │
			 *  │      │◀───│          │◀───│      │
			 *  └──────┘     └──────────┘    └──────┘
			 */
			return;
		}

		//? CASE 2: if the node is already in the list (not new)
		//? unlink it first before moving to the head
		if (node.prev && node.next) {
			//* skip over the node in the chain
			node.prev.next = node.next;
			node.next.prev = node.prev;

			/**
			 * Example before unlink:
			 *  ... <-> prevNode <-> node <-> nextNode <-> ...
			 * After unlink:
			 *  ... <-> prevNode <-> nextNode <-> ...
			 */
		}

		//* Now attach the node right after the head
		//* node should become: head <-> node <-> (old head.next)

		const oldHeadNext = this.head.next; // current most recently used node

		//* connect new node after head
		this.head.next = node;
		node.prev = this.head;

		//* link node forward to what used to be after head
		node.next = oldHeadNext;

		//* link that old node (if exists) back to our new node
		if (oldHeadNext) oldHeadNext.prev = node;

		/**
		 * Diagram of result:
		 *
		 * Before shift(node):
		 * ┌──────┐     ┌──────────┐     ┌──────────┐
		 * │ head │───▶│ oldHead  │───▶│ nextNode │
		 * │      │◀───│          │◀───│          │
		 * └──────┘     └──────────┘     └──────────┘
		 *
		 * After shift(node):
		 * ┌──────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
		 * │ head │───▶│   node   │───▶│ oldHead  │───▶│ nextNode │
		 * │      │◀───│          │◀───│          │◀───│          │
		 * └──────┘     └──────────┘     └──────────┘     └──────────┘
		 */

		//* 🧠 Special case fix:
		//* If the list had only one element before (head -> X -> tail)
		//* then the tail.prev should still point to the last node correctly
		if (this.tail.prev === this.head) {
			this.tail.prev = node;
		}

		return;
	}

	/**
	 * @description
	 * Remove the least recently used (LRU) node when the cache is full.
	 * The LRU node is always the one right before the tail.
	 */
	pop(): void {
		//? Check if we actually reached capacity
		if (this.map.size <= this.capacity) return; // not full, do nothing

		//* Get the least recently used node
		const lruNode = this.tail.prev;

		//* Safety checks — if list empty or head directly links to tail
		if (!lruNode || lruNode === this.head) return;

		/**
		 * Before removing:
		 *
		 * ┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────┐
		 * │ head │ -> │   ...    │ -> │  LRU     │ -> │ tail │
		 * │      │ <- │          │ <- │          │ <- │      │
		 * └──────┘    └──────────┘    └──────────┘    └──────┘
		 */

		//* Rewire the pointers to unlink the LRU node
		const beforeLRU = lruNode.prev; // node before the one we remove

		//* Connect the "before LRU" directly to the tail
		beforeLRU!.next = this.tail;
		this.tail.prev = beforeLRU;

		/**
		 * After removing:
		 *
		 * ┌──────┐    ┌──────────┐    ┌──────┐
		 * │ head │ -> │   ...    │ -> │ tail │
		 * │      │ <- │          │ <- │      │
		 * └──────┘    └──────────┘    └──────┘
		 */

		//* Delete the LRU node from the map (not the dummy tail)
		this.map.delete(lruNode.key);

		//* Optional: clean up its pointers (not required but safer)
		lruNode.next = null;
		lruNode.prev = null;

		return;
	}
}
