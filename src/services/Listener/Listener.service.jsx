import React, { useState, useEffect } from 'react';
import * as firebase from '../../lib/firebase';
import Item from '../../components/Item/Item.component';

import './Listener.style.scss';

import { CrossIcon } from '../../assets';

// bl_sd_list_filter
const Listener = props => {
  const [unfilteredItems, setUnfilteredItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const collectionTokenName = localStorage.getItem('token');

  // Leaving both main and local branches' changes in until i can figure out what can be safely removed.
  // main
  const [localToken, setLocalToken] = useState(props.localToken);
  const [items, setItems] = useState([]);
  const secondsInDay = 86400;
  let itemsInCollection = [];

  useEffect(() => {
    listenForUpdates();
  });

  useEffect(() => {
    let unfilteredArray = [];
    unfilteredItems.forEach(unfilteredItem => {
      unfilteredArray.push(unfilteredItem.name);

      const searchFilter = unfilteredArray.filter(unfilteredArray =>
        unfilteredArray.toLowerCase().includes(searchData.toLowerCase()),
      );

      setFilteredItems(searchFilter);
    });
  }, [searchData]);

  const handleChange = event => {
    setSearchData(event.target.value);
  };

  const clearSearch = () => {
    setSearchData('');
  };

  //To update the list of items when there is a change
  const listenForUpdates = () => {
    firebase.dataBase.collection(localToken).onSnapshot(snapshot => {
      itemsInCollection = snapshot.docs.map(doc => doc.data());
      setUnfilteredItems(itemsInCollection);

      //To check if there has been 24 hours
      itemsInCollection.forEach((item, index) => {
        //Was marked as purchased before
        if (item.lastPurchaseDate !== null) {
          let currentTimeInSeconds = new Date().getTime() / 1000;
          let lastPurchasedTimeInSeconds = item.lastPurchaseDate.seconds;
          let timeDifference =
            currentTimeInSeconds - lastPurchasedTimeInSeconds;

          //Item was purchased over 24 hours ago
          if (timeDifference >= secondsInDay) {
            itemsInCollection[index] = {
              ...itemsInCollection[index],
              over24: true,
            };
          }
          //Item was purchased less than 24 hours ago
          else {
            itemsInCollection[index] = {
              ...itemsInCollection[index],
              over24: false,
            };
          }

          //Was not marked as purchased before
        } else {
          itemsInCollection[index] = {
            ...itemsInCollection[index],
            over24: 'none',
          };
        }
      });
      setItems(itemsInCollection);
    });
  };

  return (
    <>
      <div className="search__bar">
        <input
          type="text"
          className="search__input"
          placeholder="Search..."
          value={searchData}
          onChange={handleChange}
        />

        <CrossIcon
          className={`${
            searchData.length ? '' : 'search__icon--invisible'
          } search__icon`}
          onClick={clearSearch}
        />
      </div>
      {/* <div className="items__list">
        {searchData.length < 1 ? (
          unfilteredItems.map(item => <div key={item.id}> {item.name} </div>)
        ) : (
          <div>
            {filteredItems.map(filteredItem => (
              <div> {filteredItem} </div>
            ))}
          </div>
        )}
      </div> */}
      <div className="items__list">
        {searchData.length < 1 ? (
          unfilteredItems.map(item => (
            <Item
              key={item.id}
              name={item.name}
              id={item.id}
              date={item.lastPurchaseDate}
              localToken={localToken}
              over24={item.over24}
              lastEstimate={item.lastEstimate}
              latestInterval={item.latestInterval}
              numberOfPurchases={item.numberOfPurchases}
              nextPurchaseInterval={item.nextPurchaseInterval}
            ></Item>
          ))
        ) : (
          <div>
            {filteredItems.map(filteredItem => (
              <div> {filteredItem} </div>
            ))}
          </div>
        )}
      </div>
    </>

    // Pre-existing map from main.

    // <div className="lists__container">
    //   {items.map(item => (
    //     <Item
    //       key={item.id}
    //       name={item.name}
    //       id={item.id}
    //       date={item.lastPurchaseDate}
    //       localToken={localToken}
    //       over24={item.over24}
    //       lastEstimate={item.lastEstimate}
    //       latestInterval={item.latestInterval}
    //       numberOfPurchases={item.numberOfPurchases}
    //       nextPurchaseInterval={item.nextPurchaseInterval}
    //     ></Item>
    //   ))}
    // </div>
  );
};

export default Listener;
