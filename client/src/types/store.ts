import { SessionViewEnum } from './enums';

export interface CognitoState {
  session: {
    idToken: {
      jwtToken: string;
    };
  };
}

export interface RouterState {
  name: string;
  path: string;
  params: object;
  query: object;
}

export interface RootState {
  cognito: CognitoState;
  route: RouterState;
}

export interface SessionState {
  mode: SessionViewEnum;
  busy: boolean;
  user: null;
  templates: null;
  originalDocument: null;
  document: null;
  originalTemplate: null;
  template: null;
  searchResults: null;

  themeColor: string;
}

export interface APIState {
  server: string;
}
