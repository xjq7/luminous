import { useContext } from 'react';
import { LeaferAppContext } from '~/driver/context';

export default function useLeaferApp() {
  return useContext(LeaferAppContext);
}
