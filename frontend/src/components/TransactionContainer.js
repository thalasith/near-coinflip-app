import React, { useState } from "react";
import Big from "big.js";
import ClipLoader from "react-spinners/ClipLoader";
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
  const [depositError, setDepositError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [loading, setLoading] = useState("");

  const handleDeposit = async () => {
    if (deposit === "") {
      setDepositError("Please type in a number!");
    } else {
      await contract.deposit({}, BOATLOAD_OF_GAS, parseNearAmount(deposit));
      currentUser && updateCredits();
    }
  };

  const handleDepositChange = async (e) => {
    setDepositError("");
    setDeposit(e);
  };

  const handleWithDrawChange = async (e) => {
    setWithdrawError("");
    setWithdraw(e);
  };
  const handleWithdraw = async () => {
    try {
      if (withdraw === "") {
        setWithdrawError("Please type in a number!");
      } else {
        setLoading(true);
        await contract.withdraw(
          { withdrawal: parseNearAmount(withdraw) },
          BOATLOAD_OF_GAS
        );
        currentUser && updateCredits();
        setLoading(false);
      }
    } catch (err) {
      if (
        err.kind["ExecutionError"] ===
        "Smart contract panicked: panicked at 'You do not have enough credits to withdraw', src/lib.rs:47:9"
      ) {
        setWithdrawError("You don't have enough credits to withdraw.");
      }

      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-row justify-center">
        <div className="m-1 py-1 w-1/3 bg-black text-white rounded">
          Deposit
        </div>

        <div className="m-1 py-1 w-1/3 bg-black text-white rounded">
          Withdraw
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <div className="m-1 basis-1/3">
          <input
            className="m-2 px-2 py-1 bg-gray-400 placeholder-white text-white rounded"
            placeholder="Deposit Credits (N)"
            value={deposit}
            onChange={(e) => handleDepositChange(e.target.value)}
          />
          <button
            className="rounded bg-green-900 text-white p-1"
            onClick={() => handleDeposit()}
          >
            Buy Credits
          </button>
          {depositError === "" ? <p> &nbsp;</p> : <p> {depositError}</p>}
        </div>

        <div className="m-1 basis-1/3">
          <input
            className="m-2 px-2 py-1 bg-gray-400 placeholder-white text-white rounded"
            placeholder="Withdraw Credits (N)"
            value={withdraw}
            onChange={(e) => handleWithDrawChange(e.target.value)}
          />
          <button
            className="rounded bg-red-900 text-white p-1"
            onClick={() => handleWithdraw()}
          >
            Withdraw
          </button>

          {withdrawError === "" ? (
            <p>
              {" "}
              &nbsp; <ClipLoader className="mx-2" loading={loading} size={15} />
            </p>
          ) : (
            <p> {withdrawError}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionContainer;
