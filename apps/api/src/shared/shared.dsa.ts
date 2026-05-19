import { AnimeDocument, SortOrderEnum } from '@anime';

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
