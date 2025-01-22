import { v4 } from 'uuid';
import { Cmp, CmpType } from '~/interface/cmp';

export function generateCmp(type: CmpType, cmp: Partial<Cmp>): Cmp {
  return {
    type,
    id: v4(),
    name: '',
    ...cmp,
  };
}
