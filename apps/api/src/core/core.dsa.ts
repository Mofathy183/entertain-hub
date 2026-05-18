import { AnimeDocument, SortOrderEnum } from '@anime';

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

/**
 * A reusable generic base class that implements the Insertion Sort algorithm.
 *
 * @typeParam T - The type of elements in the array (e.g., AnimeDocument, QuoteDocument)
 */
export class SortBuilder<T> {
	constructor(public readonly array: T[]) {}

	/**
	 * A generic insertion sort algorithm.
	 * - Creates a shallow copy of the input array (non-mutating).
	 * - Works for any comparable field using a custom comparator.
	 * - Can sort ascending or descending based on `order`.
	 *
	 * @param comparator - A function to compare two elements (a, b)
	 * @param order - Sort order (ASC or DESC)
	 * @returns A **new** sorted array (original array remains unchanged)
	 */
	public sortBuilder(
		comparator: (a: T, b: T) => number,
		order: SortOrderEnum,
	): T[] {
		// Make a shallow copy to avoid mutating the original array
		const sortedArray = [...this.array];

		// Start from index 1 — element at index 0 is trivially "sorted"
		for (let i = 1; i < sortedArray.length; i++) {
			const key = sortedArray[i]; // The element we want to insert
			let j = i - 1;

			// Shift elements that should come after `key` one position to the right
			while (
				j >= 0 &&
				((order === SortOrderEnum.ASC &&
					comparator(sortedArray[j], key) > 0) ||
					(order === SortOrderEnum.DESC &&
						comparator(sortedArray[j], key) < 0))
			) {
				sortedArray[j + 1] = sortedArray[j];
				j--;
			}

			// Place `key` in the correct position
			sortedArray[j + 1] = key;
		}

		return sortedArray;
	}
}

/**
 * TreeNode represents a single node in the binary tree.
 ** that will take the title of the anime from the DB and the rating too,
 ** and it will sort them as a Binary Tree and I will make the highest rate as the root
 *
 * Properties:
 *  - title: the display title (e.g., anime title or "Average Rating")
 *  - rating: numeric key used for placement in the tree (comparison basis)
 *  - left: subtree with nodes that have rating < this.rating
 *  - right: subtree with nodes that have rating >= this.rating
 */
export class TreeNode {
	public left: TreeNode | null = null; // that contain all the rates that lower than the root
	public right: TreeNode | null = null; // that contain all the highest rates than the root

	/**
	 * Create a TreeNode.
	 ** the rate of the anime from the DB
	 ** will be the title from the DB
	 * @param title - Title or label for the node (e.g., "Naruto", or "Average Rating").
	 * @param rating - Numeric rating used for comparisons (key).
	 */
	constructor(
		public title: string,
		public rating: number,
	) {}
}

/**
 * BinaryTree builds a binary tree from a list of anime documents.
 * Design decisions:
 *  - Uses an "Average Rating" node as the root by default (creative UX choice).
 *  - All anime with rating < average go to the left, >= average go to the right.
 *  - Intended for small, fixed-size datasets (e.g., top 10). Works fine for that use-case.
 */
export class BinaryTree {
	/**
	 * @param list - the list of anime documents pulled from DB (must contain title and rating)
	 */
	constructor(private list: AnimeDocument[]) {}
	/**
	 * Compute the average rating across the provided list, create a TreeNode for it
	 * and return that node.
	 *
	 * This node becomes the conceptual root dividing below/above-average nodes.
	 *
	 * @param title - optional title for the constructed average node (default "Average Rating")
	 * @returns TreeNode representing the average rating
	 */
	private getAverage(title: string = 'Average Rating'): TreeNode {
		//* Defensive: if list is empty, avoid division by zero — create a zero-valued node.
		if (this.list.length === 0) return new TreeNode(title, 0);

		//* Sum ratings and compute average
		const total = this.list.reduce((sum, anime) => sum + anime.rating, 0);
		const avg = parseFloat((total / this.list.length).toFixed(2)); // limit to 2 decimals for display

		//* Return a node that will act as the root (real node with title & rating).
		return new TreeNode(title, avg);
	}

	/**
	 * @description
	 * Insert a new node into the binary tree based on its rating.
	 * it will compare the new node rating with the root rating
	 *    * Insert a new node into the tree relative to the provided root.
	 *
	 * Insertion rule:
	 *  - If newNode.rating < root.rating => go left
	 *  - Else (>=) => go right
	 *
	 * This method is recursive and will find the appropriate leaf position.
	 *
	 * - if the new node rating is Less than the root rating, Go to the Left Subtree
	 * - if the new node rating is Greater than or Equal to the root rating, Go to the Right Subtree
	 *
	 * it will call itself recursively until it find the correct position to insert the new node
	 *
	 * @param root // The root node of the binary tree, compare against (subtree root).
	 * @param newNode // The new node to be inserted into the tree.
	 */
	private insert(root: TreeNode, newNode: TreeNode): void {
		//? if the new node rating is LESS than the root rating, Go to the Left Subtree
		if (newNode.rating < root.rating) {
			//* If left child is empty, attach here; otherwise recurse deeper.
			if (!root.left) root.left = newNode;
			else this.insert(root.left, newNode);
		}

		//? if the new node rating is GREATER or EQUAL than to the root rating, Go to the Right Subtree
		else {
			//* by default it's greater than or equal to will trigger that else block
			if (!root.right) root.right = newNode;
			else this.insert(root.right, newNode);
		}
	}

	/**
	 * Build a binary tree using the provided root node.
	 *
	 * Important:
	 *  - If root is the Average node, it is NOT pulled from this.list, so
	 *    we insert every anime in this.list under that root.
	 *
	 * @param root - the TreeNode to use as the root of the tree
	 * @returns the root node after having inserted every anime in this.list
	 */
	private buildTree(root: TreeNode): TreeNode {
		//* insert each anime into the binary tree
		for (const anime of this.list) {
			const newNode = new TreeNode(anime.title, anime.rating);
			this.insert(root, newNode);
		}

		return root;
	}

	/**
	 * @description
	 * Build the binary tree and return **only the root node**,
	 * which contains the full nested structure of the entire tree.
	 ** "top10" method is taking a nine anime because the root
	 *  and will sort it as a tree for send it for response to the frontend
	 * it will loop through the anime array and add it be the add method to add all the anime
	 *
	 * This method is designed for use in your **API layer**:
	 * - The backend can simply `return tree.getTreeRoot()`.
	 * - The frontend (Angular) can recursively traverse it to visualize or render the hierarchy.
	 *
	 * Example structure of the returned root:
	 * ```json
	 * {
	 *   "title": "Average Rating",
	 *   "rating": 7.5,
	 *   "left": {
	 *     "title": "Naruto",
	 *     "rating": 7.3,
	 *     "left": null,
	 *     "right": { ... }
	 *   },
	 *   "right": {
	 *     "title": "Attack on Titan",
	 *     "rating": 9.0,
	 *     "left": null,
	 *     "right": { ... }
	 *   }
	 * }
	 * ```
	 *
	 * @returns {TreeNode} The root node of the binary tree, containing all children
	 */
	public getTreeRoot(): TreeNode {
		//* Create a root node using the average rating
		const averageNode = this.getAverage();

		//* Build the tree by inserting all anime under the root
		//* Return the root node (with its entire structure)
		return this.buildTree(averageNode);
	}
}

export class FisherYatesShuffle<T> {
	//* it will use for both anime and quote for the random indexes
	private index: number;
	readonly shuffledArray: T[];
	readonly length: number;

	constructor(array: T[]) {
		this.index = 0;
		this.shuffledArray = [...array]; // create a copy of the array to avoid modifying the original array
		this.length = array.length;
		//* shuffle the array initially
		this.shuffle();
	}

	private shuffle() {
		//* Fisher-Yates Shuffle Algorithm
		//* it will loop from the end of the array to the start
		for (
			let currentIndex = this.length - 1;
			currentIndex > 0;
			currentIndex--
		) {
			//* generate a random index from 0 to currentIndex
			const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
			[
				//* swap the elements at currentIndex and randomIndex
				this.shuffledArray[currentIndex],
				this.shuffledArray[randomIndex],
			] = [
				//* destructuring assignment to swap
				this.shuffledArray[randomIndex],
				this.shuffledArray[currentIndex],
			];
		}
	}

	pickOne(): T {
		//? if we reach the end of the array we will reshuffle it
		if (this.index >= this.length) {
			//* shuffle the array again
			this.shuffle();
			//* reset the index to 0
			this.index = 0;
		}

		//* otherwise return the next random element
		return this.shuffledArray[this.index++];
	}
}
