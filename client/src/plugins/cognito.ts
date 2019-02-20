import attachCognitoModule from '@vuetify/vuex-cognito-module';
import axios from 'axios';
import store from '../store';

attachCognitoModule(store, {
  userPoolId: process.env.VUE_APP_COGNITO_POOL_ID,
  identityPoolId: process.env.VUE_APP_COGNITO_IDENT_ID,
  userPoolWebClientId: process.env.VUE_APP_COGNITO_CLIENT_ID,
  region: process.env.VUE_APP_COGNITO_REGION,
}, 'cognito');

/// When the user is logged in, update the session and add the token to request headers.
/// When the user is not logged in, don't sent an Authorization header.
axios.interceptors.request.use((config) => store.dispatch('cognito/fetchSession').then(() => {
  config.headers.Authorization = `Bearer ${store.state.cognito.session.idToken.jwtToken}`;
  return Promise.resolve(config);
}).catch(() => Promise.resolve(config)));
