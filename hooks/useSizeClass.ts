import { useSizeClass as useSizeClassOriginal, SizeClass } from '../malin_modules/sizeClass';
import type { SizeClassInfo } from '../malin_modules/sizeClass';

export { SizeClass };
export type { SizeClassInfo };

export const useSizeClass = useSizeClassOriginal;

export const useIsLargeScreen = useSizeClassOriginal;
