import logo from './logo.svg';
import './App.css';

import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";

async function App() {

  const querySnapshot = await getDocs(collection(db, "MenuData"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      console.log(`${doc.data().name} , ${doc.data().price}원, ${doc.data().type}, ${doc.data().cafeteria.name}`);
    });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
