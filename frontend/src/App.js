import React, { useState, useEffect } from "react";
import Big from "big.js";
import * as nearAPI from "near-api-js";
import "./App.css";
import NavBar from "./components/NavBar";
import TransactionContainer from "./components/TransactionContainer";

const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

function App({ contract, currentUser, nearConfig, wallet }) {
  const [credits, setCredits] = useState("");
  const [flips, setFlips] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    currentUser && updateCredits();
  }, [contract, currentUser]);

  const updateCredits = async () => {
    const credits = await contract.get_credits({
      account_id: currentUser.accountId,
    });

    setCredits(formatNearAmount(credits.toLocaleString().replace(/,/g, "")));
  };

  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const outcome = await contract.play(
      { coin_side: "heads" },
      BOATLOAD_OF_GAS
    );
    currentUser && updateCredits();
    setFlips([...flips, outcome]);
    setLoading(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    wallet.requestSignIn(
      {
        contractId: nearConfig.contractName,
      },
      "Coin Flip"
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };
  return (
    <div className="App">
      <NavBar currentUser={currentUser} signIn={signIn} signOut={signOut} />
      <TransactionContainer
        currentUser={currentUser}
        contract={contract}
        updateCredits={updateCredits}
      />

      <>
        <h3>Play</h3>
        <p>Current Credits: {credits}</p>
        <br />

        <form onSubmit={(e) => onSubmit(e)}>
          <button type="submit">Flip</button>
        </form>
        {loading && <p>Flipping...</p>}

        {flips.map((f, i) => (f ? <p key={i}>Won</p> : <p key={i}>Lost</p>))}
      </>
    </div>
  );
}

export default App;
