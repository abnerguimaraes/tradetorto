import React, { useState, useContext } from 'react';
import { Button, TextInput } from 'carbon-components-react';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

import { AppContext } from '../../store/AppContext';
import classes from './login.module.scss'
import ComponentWrapper from '../../components/ComponentWrapper';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgpCSZwW8ujKeHGmLF4ovBUqM95NG1ebg",
  authDomain: "tradetorto.firebaseapp.com",
  databaseURL: "https://tradetorto-default-rtdb.firebaseio.com",
  projectId: "tradetorto",
  storageBucket: "tradetorto.appspot.com",
  messagingSenderId: "901021173643",
  appId: "1:901021173643:web:3e364f9c60c2b41bc7d18e"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Login() {
  const [ userName, setUserName ] = useState('guimaraesabner@gmail.com');
  const [ userPass, setUserPass ] = useState('Teste123@');
  const [ mailValid, setMailValid ] = useState(true);
  const [ passValid, setPassValid ] = useState(true);
  const { initApp } = useContext(AppContext);

  function handleSetUserName(event){ 
    setMailValid(true);
    setUserName(event.target.value);
  }

  function handleSetUserPass(event) {
    setPassValid(true);
    setUserPass(event.target.value)
  }

  function handleMailValid(event) {
    setMailValid(event.target.validity.valid);
  }

  async function handleLogin() {
    const auth = getAuth();

    try {
      const firebaseCredential = await signInWithEmailAndPassword(auth, userName, userPass);

      initApp({
        app: app,
        database: database,
        isLogged: true,
        userId: firebaseCredential.user.uid,
        userEmail: userName,
      });
    
    } catch (err) {
      setPassValid(false);
      console.error(err);

    }
  }

  return (
    <section className={classes.login}>
      <div className={classes.fieldContainer}>
        <div className={classes.componentsArea}>
          <div className={classes.title}> Entrar </div>
          <div className={classes.subtitle}> Não tem conta? Problema seu! </div>
          <ComponentWrapper padding={'16px'}>
            <TextInput
              id='txtUserMail'
              labelText='e-mail'
              helperText='informe seu e-mail'
              type='email'
              value={userName}
              onChange={handleSetUserName}
              onBlur={handleMailValid}
              invalid={!mailValid}
              invalidText='e-mail não é válido'
            />
          </ComponentWrapper>
          <ComponentWrapper padding={'0px 16px 16px 16px'}>
            <TextInput 
                id='txtUserPass'
                labelText='senha'
                helperText='informe sua senha'
                type='password'
                value={userPass}
                onChange={handleSetUserPass}
                invalid={!passValid}
                invalidText='usuário e/ou senha válidos'
              />
          </ComponentWrapper>
        </div>
        <div className={classes.buttonArea}>
          <Button onClick={handleLogin}> entrar </Button>
        </div>
      </div>
    </section>
  )
}

export default Login