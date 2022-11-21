/**
 * Recursively goes through an array to find the first object for which findFn returns true.
 *
 * @param findFn - recursiveFind passes this function down to an Array.find() function, used as the predicate
 * @param arrayWithNestedKey Array which has nested arrays as keys
 * @param nestKey Optional: The key in which the nested arrays, Default: "nextTestTypesOrCategories"
 * @returns The first object for which findFn returns a truthy value, or undefined
 */
export default function recursiveFind<T extends Record<string, any>>(
  findFn: (args: any) => boolean,
  arrayWithNestedKey: T[],
  nestKey: string = "nextTestTypesOrCategories"
): T | undefined {
  const found = arrayWithNestedKey.find((item) => findFn(item));
  if (found) {
    return found;
  }
  for (const item of arrayWithNestedKey) {
    if (item.hasOwnProperty(nestKey)) {
      const nestedFound = recursiveFind(findFn, item[nestKey] as T[], nestKey);
      if (nestedFound) {
        return nestedFound;
      }
    }
  }
  return undefined;
}
