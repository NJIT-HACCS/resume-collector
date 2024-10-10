import DetailForm from './fillout';
import { Helmet } from "react-helmet";
import logo from './round_HACCS_logo.png';
import './App.css';

function App() {
  return (
    <>
    <Helmet>
      <title>Resume Collection </title>
    </Helmet>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <DetailForm></DetailForm>
        <p>
          
        </p>
        <a
          className="App-link"
          href="https://haccsnjit.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit us HERE for our upcoming events!
        </a>
      </header>
    </div>
    </>
  );
}

export default App;
