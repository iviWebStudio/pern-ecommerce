import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";


function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:9000/api/users`)
            .then(response => {
                console.log(response.json())
                setData(response)
            }).catch(e => {
            console.log(e)
        })
    }, [])


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>

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
