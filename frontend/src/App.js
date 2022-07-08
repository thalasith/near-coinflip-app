import React, { useState, useEffect } from "react";
import Big from "big.js";
import * as nearAPI from "near-api-js";
import "./App.css";

const {
  KeyPair,
  utils: {
    format: { formatNearAmount, parseNearAmount },
  },
} = nearAPI;

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

function App({ contract, currentUser, nearConfig, wallet }) {
  const [credits, setCredits] = useState("");
  const [amount, setAmount] = useState("");
  const [flips, setFlips] = useState([]);

  const updateCredits = async () => {
    const credits = await contract.get_credits({
      account_id: currentUser.accountId,
    });
    setCredits("" + credits);
  };

  const handleDeposit = async () => {
    const credits = await contract.deposit(
      {},
      BOATLOAD_OF_GAS,
      parseNearAmount(amount)
    );
    console.log(parseNearAmount(amount));
    updateCredits();
  };

  const handleWithdraw = async () => {
    await contract.withdraw(
      { withdrawal: parseNearAmount("5") },
      BOATLOAD_OF_GAS
    );
    updateCredits();
  };

  const onSubmit = async () => {
    const outcome = await contract.play(
      { coin_side: "heads" },
      BOATLOAD_OF_GAS
    );
    setFlips([...flips, outcome]);
  };

  useEffect(() => {
    updateCredits();
  }, [contract, currentUser]);

  const signIn = () => {
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
      {currentUser ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={signIn}>Log In</button>
      )}
      <>
        <h3>Play</h3>
        <p>Current Credits: {credits}</p>
        <input
          placeholder="Credits (N)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <button onClick={() => handleDeposit()}>Buy Credits</button>
        <br />
        <br />
        <button onClick={() => handleWithdraw()}>Testing Withdrawal</button>
        <form onSubmit={onSubmit}>
          <button type="submit">Flip</button>
        </form>

        {flips.map((f, i) => (f ? <p key={i}>Won</p> : <p key={i}>Lost</p>))}
      </>
      ;
    </div>
  );
}

export default App;
