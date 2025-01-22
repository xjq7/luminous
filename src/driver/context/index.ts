import { App } from 'leafer-ui';
import { createContext } from 'react';

export type ILeaferApp = App | null;

const LeaferAppContext = createContext<ILeaferApp>(null);

export { LeaferAppContext };
