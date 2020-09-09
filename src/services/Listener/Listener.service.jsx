import React, { useState, useEffect } from 'react';
import * as firebase from '../../lib/firebase';
import Item from '../../components/Item/Item.component';

const Listener = props => {
  const [localToken, setLocalToken] = useState(props.localToken);
  const [items, setItems] = useState([]);
  let itemsInCollection = [];

  useEffect(() => {
    listenForUpdates();
  });

  let itemsByEstimatedDays = [];

  //To update the list of items when there is a change
  const listenForUpdates = () => {
    firebase.dataBase.collection(localToken).onSnapshot(snapshot => {
      itemsInCollection = snapshot.docs.map(doc => doc.data());

      //To check if there has been 24 hours
      itemsInCollection.forEach((item, index) => {
        //Was marked as purchased before
        if (item.lastPurchaseDate !== null) {
          let currentTimeInSeconds = new Date().getTime() / 1000;
          let lastPurchasedTimeInSeconds = item.lastPurchaseDate.seconds;
          let timeDifference =
            currentTimeInSeconds - lastPurchasedTimeInSeconds;

          //Item was purchased over 24 hours ago
          if (timeDifference >= 86400) {
            // There are 86400 seconds in a 24 hour day
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

        //To add items to itemsByEstimatedDays
        let nextPurchaseInterval = item.nextPurchaseInterval;
        let newValue = { [nextPurchaseInterval]: item };
        itemsByEstimatedDays.push(newValue);
      });

      //To sort the itemsByEstimatedDays
      let sortedItemsByEstimatedDays = itemsByEstimatedDays.slice(0);
      sortedItemsByEstimatedDays.sort((a, b) => {
        return a.estimatePurchase - b.estimatePurchase;
      });

      itemsInCollection = [];
      setItems(itemsInCollection);
    });
  };

  return (
    <div className="lists__container">
      {items.map(item => (
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
          resupplyPeriod={item.resupplyPeriod}
        ></Item>
      ))}
    </div>
  );
};

export default Listener;
