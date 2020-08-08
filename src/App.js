import React, { useState } from 'react';
import AddItem from './components/AddItem/AddItem.component';
import Listener from './services/Listener/Listener.service';
import './App.css';

function App() {
  //To display the items from database
  const [itemsDisplay, setItemsDisplay] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setItemsDisplay(true)}>Click to get items!</button>
      {itemsDisplay && <Listener />}
      <AddItem />
    </div>
  );
}

export default App;
