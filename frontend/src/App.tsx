import './App.css'
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import * as jose from 'jose';
import { JWT_REGISTER_TOKEN } from './config/env';

function parseJwt<T>(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload) as T;
}

interface IUser {
  name: string
  lastname: string;
  email: string
  picture: string,
  id: string,
  iss: 'google' | 'facebook'
}

interface IGoogleResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

interface IGoogleToken {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
}

interface IFacebookResponse {
  name: string;
  email: string;
  picture: {
      data: {
          height: number;
          is_silhouette: boolean;
          url: string;
          width: number;
      };
  };
  id: string;
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

function createUserWithGoogle(params: IGoogleResponse) {
  const { clientId, credential, select_by } = params
  const urlParams = new URLSearchParams();
  urlParams.append('clientId', clientId);
  urlParams.append('credential', credential);
  urlParams.append('select_by', select_by);
  

  const url = `http://localhost:4000/auth/google?${urlParams.toString()}`

  fetch(url, {
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
}

const handler = () => {
  fetch("http://localhost:4000/", {
    "headers": {
      "accept": "*/*",
      "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    },
    "referrer": "http://localhost:4000/api",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
}

function App() {

  const onSuccess = async (data: IGoogleResponse) => {
    return createUserWithGoogle(data)
  };
  const responseFacebook = (response: IFacebookResponse) => {
    const { name: fullname, email, picture: { data: { url: picture } }, id, userID } = response
    const user: IUser = {
      name: fullname.split(' ')[0],
      lastname: fullname.split(' ')[1],
      email,
      iss: 'facebook',
      id: id || userID,
      picture
    }
    console.log('facebook: ',JSON.stringify(user, null, 2))
    // Aqui você pode lidar com a resposta do Facebook após o login.
  };

  return (
    <>
      <GoogleLogin onSuccess={onSuccess} onError={() => {
        console.log('deu ruim')
      }} />
      <FacebookLogin
        appId="2474580856098906"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
      <button onClick={() => handler()}>Send Event</button>
    </>
  )
}

export default App
