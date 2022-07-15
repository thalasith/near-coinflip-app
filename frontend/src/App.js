import React, { useState, useEffect } from "react";
import Big from "big.js";
import * as nearAPI from "near-api-js";
import "./App.css";
import NavBar from "./components/NavBar";
import TransactionContainer from "./components/TransactionContainer";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [coinSide, setCoinSide] = useState(true);
  const [latestResults, setLatestResults] = useState({
    coinSide: "",
    result: null,
  });

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
    !(latestResults.result === null) && setFlips([...flips, latestResults]);
    let coin_side = coinSide ? "heads" : "tails";

    e.preventDefault();
    const outcome = await contract.play(
      { coin_side: coin_side },
      BOATLOAD_OF_GAS
    );
    currentUser && updateCredits();
    setLatestResults({ coinSide: coin_side, result: outcome });

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

  const result = latestResults.result ? (
    <p className="bg-green-900 text-white rounded m-2 py-1">
      You picked {latestResults.coinSide} and you won!
    </p>
  ) : (
    <p className="bg-red-900 text-white rounded m-2 py-1">
      You picked {latestResults.coinside} and you lost.
    </p>
  );
  return (
    <div className="App">
      <NavBar currentUser={currentUser} signIn={signIn} signOut={signOut} />

      {!currentUser && <p className="text-3xl">Please log in to play!</p>}
      {currentUser && (
        <TransactionContainer
          currentUser={currentUser}
          contract={contract}
          updateCredits={updateCredits}
        />
      )}
      {currentUser && (credits === "" || credits === "0") && (
        <p className="text-3xl">
          Please buy credits first! You will need at least one to play.
        </p>
      )}
      {currentUser && !(credits === "" || credits === "0") && (
        <div className="container mx-auto">
          <p className="text-3xl">Play</p>

          <p>You currently have {credits} credits to play.</p>
          <br />

          <div className="py-2">
            <button
              className="bg-green-900 text-white rounded mx-2 w-24 h-10"
              onClick={() => setCoinSide(true)}
            >
              Heads
            </button>
            <button
              className="bg-red-900 text-white rounded mx-2 w-24 h-10"
              onClick={() => setCoinSide(false)}
            >
              Tails
            </button>
          </div>
          <form onSubmit={(e) => onSubmit(e)}>
            <p className="py-4 text-xl">
              {" "}
              You are flipping {coinSide ? "Heads" : "Tails"}.
            </p>
            <button
              className="bg-black text-white rounded hover:bg-green-900 p-2 px-8"
              type="submit"
            >
              Flip
            </button>
          </form>
          {loading && <p>Flipping...</p>}

          <ClipLoader className="my-10" loading={loading} size={100} />
          {!loading && (
            <div className="container mx-auto w-1/4 py-6">
              {!(
                latestResults.coinSide === "" || latestResults.result === null
              ) &&
                (latestResults.result ? (
                  <p className="bg-green-900 text-white rounded m-2 py-1">
                    You picked {latestResults.coinSide} and you won!
                  </p>
                ) : (
                  <p className="bg-red-900 text-white rounded m-2 py-1">
                    You picked {latestResults.coinSide} and you lost.
                  </p>
                ))}
            </div>
          )}

          <div className="container mx-auto w-1/4 py-6">
            <p className="text-3xl">Your past results:</p>
            {flips.map((f, i) =>
              f.result ? (
                <p className="bg-green-900 text-white rounded m-2 py-1" key={i}>
                  #{i + 1}. You picked {f.coinSide} and you won!
                </p>
              ) : (
                <p className="bg-red-900 text-white rounded m-2 py-1" key={i}>
                  #{i + 1}. You picked {f.coinSide} and you lost.
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
