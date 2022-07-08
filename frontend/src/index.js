import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import getConfig from "./config.js";
import * as nearAPI from "near-api-js";
import { Buffer } from "buffer";
global.Buffer = Buffer;

// Initialize contract
async function initContract() {
  //process.env.NODE_ENV ||
  const nearConfig = getConfig("testnet");

  const near = await nearAPI.connect({
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  // Load in account data
  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  // Initializing our contract APIs by contract name and configuration
  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read-only, they don't modify the state but usually return some value
      viewMethods: ["get_credits"],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: ["new", "deposit", "play"],
      // Sender is the account ID to initialize transaction
      // getAccountId() will return empty string if user is still unauthorized
      sender: walletConnection.getAccountId(),
    }
  );

  return { contract, currentUser, nearConfig, walletConnection };
}
const root = ReactDOM.createRoot(document.getElementById("root"));
window.nearInitPromise = initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    root.render(
      <App
        contract={contract}
        currentUser={currentUser}
        nearConfig={nearConfig}
        wallet={walletConnection}
      />
    );
  }
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
