import type { Lang } from './types';
import type { HomeCopy } from './homeTypes';
import { homeUz } from './home.uz';
import { homeRu } from './home.ru';
import { homeEn } from './home.en';

export const HOME: Record<Lang, HomeCopy> = { uz: homeUz, ru: homeRu, en: homeEn };
