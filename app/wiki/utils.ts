import type { WikiItem } from "./types";

/**
 * Separate path and display name from title
 */
export const splitTitlePathAndName = (
  title: string,
): { path: string; displayName: string } => {
  if (!title.startsWith("/")) {
    return { path: "/", displayName: title };
  }

  const lastSlashIndex = title.lastIndexOf("/");
  if (lastSlashIndex === 0) {
    return { path: "/", displayName: title.substring(1) };
  }

  const path = title.substring(0, lastSlashIndex);
  const displayName = title.substring(lastSlashIndex + 1);

  return { path, displayName };
};

/**
 * Get display name from title
 */
export const getDisplayName = (title: string): string => {
  return splitTitlePathAndName(title).displayName;
};

/**
 * Get path from title
 */
export const getPath = (title: string): string => {
  return splitTitlePathAndName(title).path;
};

/**
 * Get hierarchy level of an item
 */
export const getItemLevel = (item: WikiItem): number => {
  const path = getPath(item.title);
  return path.split("/").filter(Boolean).length;
};

/**
 * Check if child item is descendant of parent item
 */
export const isDescendantOf = (
  childTitle: string,
  parentTitle: string,
): boolean => {
  const childPath = getPath(childTitle);
  const parentPath = getPath(parentTitle);

  if (parentPath === "/") return childPath !== "/";
  return childPath.startsWith(parentPath + "/") || childPath === parentPath;
};

/**
 * Organize items into tree structure
 */
export const organizeItemsIntoTree = (items: WikiItem[]) => {
  return [...items].sort((a, b) => {
    const pathA = getPath(a.title);
    const pathB = getPath(b.title);

    if (pathA !== pathB) {
      return pathA.localeCompare(pathB);
    }

    return getDisplayName(a.title).localeCompare(getDisplayName(b.title));
  });
};
