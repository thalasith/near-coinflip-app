import React, { useState } from "react";
import Big from "big.js";
import * as nearAPI from "near-api-js";
const {
  utils: {
    format: { parseNearAmount },
  },
} = nearAPI;

const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const TransactionContainer = ({ contract, updateCredits, currentUser }) => {
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  const handleDeposit = async () => {
    await contract.deposit({}, BOATLOAD_OF_GAS, parseNearAmount(deposit));
    currentUser && updateCredits();
  };

  const handleWithdraw = async () => {
    await contract.withdraw(
      { withdrawal: parseNearAmount(withdraw) },
      BOATLOAD_OF_GAS
    );

    currentUser && updateCredits();
  };
  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="m-1 py-1 basis-1/3 bg-black text-white rounded">
          Deposit
        </div>

        <div className="m-1 py-1 basis-1/3 bg-black text-white rounded">
          Withdraw
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="m-1 basis-1/3">
          <input
            className="m-2 px-2 py-1 bg-gray-400 placeholder-white text-white rounded"
            placeholder="Deposit Credits (N)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
          <button
            className="rounded bg-green-900 text-white p-1"
            onClick={() => handleDeposit()}
          >
            Buy Credits
          </button>
        </div>

        <div className="m-1 basis-1/3">
          {" "}
          <input
            className="m-2 px-2 py-1 bg-gray-400 placeholder-white text-white rounded"
            placeholder="Withdraw Credits (N)"
            value={withdraw}
            onChange={(e) => setWithdraw(e.target.value)}
          />
          <button
            className="rounded bg-red-900 text-white p-1"
            onClick={() => handleWithdraw()}
          >
            {" "}
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionContainer;
