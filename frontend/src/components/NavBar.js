import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import * as nearAPI from "near-api-js";

const {
  utils: {
    format: { formatNearAmount },
  },
} = nearAPI;

const NavBar = ({ currentUser, signIn, signOut }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-black mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="/"
            >
              Thalasith's Coin Flip App
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <GiHamburgerMenu />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {currentUser && (
                <li className="nav-item">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white"
                    href="/"
                  >
                    Logged in as:{" "}
                    <p className="pl-2 text-yellow-300">
                      {" "}
                      {currentUser.accountId}
                    </p>
                  </a>
                </li>
              )}
              {currentUser && (
                <li className="nav-item">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white"
                    href="/"
                  >
                    Near in Wallet:{" "}
                    <p className="pl-2 text-yellow-300">
                      {" "}
                      {formatNearAmount(currentUser.balance, 2)}
                    </p>
                  </a>
                </li>
              )}
              {currentUser ? (
                <li className="nav-item">
                  <a
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug rounded bg-white text-black hover:text-white hover:bg-black"
                    href="/"
                    onClick={signOut}
                  >
                    Sign Out
                  </a>
                </li>
              ) : (
                <li className="nav-item">
                  <a
                    href="/"
                    onClick={(e) => signIn(e)}
                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug rounded bg-white text-black hover:text-white hover:bg-black"
                  >
                    Sign In
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
