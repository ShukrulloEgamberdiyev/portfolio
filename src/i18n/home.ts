import { useLang } from './index';
import type { HomeCopy } from './homeTypes';
import { HOME } from './home.data';

export { HOME };

export function useHome(): HomeCopy {
  return HOME[useLang().lang];
}
