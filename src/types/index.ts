export interface ClassifiedImage {
  id: string; // Added id for unique identification
  file: File;
  category: string;
  preview: string;
}

export const VALID_CATEGORIES = ['sandalias', 'tenis', 'zapatos', 'tacones', 'botas'] as const;
export type ShoeCategory = typeof VALID_CATEGORIES[number];