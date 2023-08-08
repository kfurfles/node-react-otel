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

function App() {

  const onSuccess = async (data: IGoogleResponse) => {
    return createUserWithGoogle(data)
    // const { credential } = data
    // const {
    //   given_name: name,
    //   family_name: lastname,
    //   email,
    //   picture,
    //   sub,
    // } = parseJwt<IGoogleToken>(credential)

    // const user: IUser = {
    //   name,
    //   lastname,
    //   email,
    //   iss: 'google',
    //   picture,
    //   id: sub
    // }

    // new jose.SignJWT({

    // })
    // const newJWt = new jose.SignJWT({
    //   ...user
    // })
    // newJWt.sign(JWT_REGISTER_TOKEN)
    //   .then(encoded => {
    //     console.log(encoded)
    //   })
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
      <button></button>
    </>
  )
}

export default App
