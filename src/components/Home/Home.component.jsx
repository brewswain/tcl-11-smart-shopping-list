import React, { useState } from 'react';
import getToken from '../../lib/tokens';
import * as firebase from '../../lib/firebase';
import { useHistory } from 'react-router-dom';

import { CustomButton, FormInput, Lists } from '../component.index';
import './Home.style.scss';

const Home = () => {
  const [localToken, setLocalToken] = useState('');
  const [tokenValue, setTokenValue] = useState('');

  const history = useHistory();

  const joinExistingList = async () => {
    let tokenRef = firebase.dataBase.collection(`${tokenValue}`);
    let snapshot = await tokenRef.get();

    if (snapshot.empty) {
      alert(
        "Sorry, this collection doesn't exist. Please try again or create a new list.",
      );
    } else {
      addTokenToStorage(tokenValue);
      history.push('/');
    }
  };

  const generateToken = () => {
    //To generate a new token:
    const token = getToken();
    setLocalToken(token);

    //To set the item to the local storage

    localStorage.setItem('token', token);

    // To go to addItem page
    history.push('/list', { localToken: token });
  };

  //To add the token to the storage
  const addTokenToStorage = token => {
    //To set the item to the local storage
    localStorage.setItem(token, token);
  };

  // Dynamically sets our tokenValue based on our FormInput's value
  const onChange = event => {
    setTokenValue(event.target.value);
  };

  return (
    <div>
      {localToken ? (
        <>
          <h1 className="page__title">Welcome Back!</h1>
          <br /> <br />
          {/* <button onClick={redirectAddItem}>Add a new Item</button> */}
          <CustomButton onClick={joinExistingList}>Add a new Item</CustomButton>
        </>
      ) : (
        <>
          <div>
            <h1 className="page__title">Welcome!</h1>
            <p>You do not have a shopping list created.</p>
            {/* <button onClick={generateToken}>Create a New Shopping List</button> */}
            <CustomButton onClick={generateToken} large>
              Create a New Shopping List
            </CustomButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
