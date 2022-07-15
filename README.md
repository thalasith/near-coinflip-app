# Coinflip Smart Contracting

Huge shout out to Matt Lockyer's tutorial online - a majority of the smart contract is based on that tutorial but with some slight tweaks and additional features (such as withdrawing the credits at the end)

```
+ ## Core Tech Stack Used
```

### Programming Languages Learnt/Used

- Rust Programming Language
- Javascript

### Tech Stack

- Frontend: React.js
- CSS: Tailwind CSS
- Blockchain: Near Protocol
- Webhosting: Vercel

## The Purpose of this Project and Reasons for these Purposes

1. Know what a smart contract can be used for.

   - Building this I learnt some definite use cases for smart contracts.
   - I also chose to build on NEAR Protocol for personal beliefs in the protocol. NEAR is quick to approve transactions, it has cheap fees and it is very developer friendly vs other blockchains that I've seen. The architecture and UX decisions made on the developer side was really impressive.

2. Get better at Rust Programming Language.

   - Outside of Ethereum (Solidity language), a majority of smart contracts and blockchains have been built on Rust.
   - Although Ethereum has the most volume and liquidity, I felt that learning Solidity is too narrow that the only knowledge gained would specifically be for smart contracts.
   - Learning Rust is a much more general-purpose language and has other applications outside of smart contracts that are potentially useful down the line.
   - Rust also solidifies my understanding of programming. My previous experiences have been on much higher level languages (i.e. Python and Javascript). Thus Rust exposes me to a variety of new concepts.
   - I also keep hearing about Move as another Smart Contract Language thats picking up steam. Move is based on Rust and I anticipate there to be learning synergies if Move takes off.

3. Understand how a smart contract can connect with the front end.

   - Another issue that I run into as a consumer is not knowing how to interact with a smart contract using Web2 technologies.
   - Near Protocol has an "npx create-near-app" command that gives you a lot of boiler plate code with integrations to the Near RPC built in. I specifically chose not to do this because I wanted to get my hands dirty with the integration to understand how it works.
   - This project helped me grasp understandings of javascript libraries that Near Protocol developped to make integration with the frontend much more accessible.

4. Build a UI/UX friendly frontend that people can play around with and that I would be proud of to show to people.
   - Practice my Frontend skillsets and make sure it is still sharp.
   - Build a project that I can showcase as part of my portfolio.

## Key Features Needed

Below is a list of the key features the application needs and the decision for them:

1. Users will need to log in to this application before they start playing. Smart Contract Function: None - built into Near's JS API

   - This way, users can't flip for free and they have something to lose potentially.

2. Users will also need to buy credits prior to playing. Smart Contract Function: `deposit(&mut self)`

   - The way smart contracts work is that a user needs to approve every time they deposit their Near tokens. Thus, everytime somebody played, they would be sent to their wallet with an additional friction point of a click.
   - We want our users to flip as much as possible and thus we reduce a friction point if we ask them to deposit a set amount of credits rather sending them to approve a transaction each time they play.

3. Users will also need to withdraw their credits after they are done playing. Smart Contract Function: `withdraw(&mut self, withdrawal:U128)`

   - It would be a terrible way to gain traction if we only allowed people to deposit their NEAR without withdrawing it.
   - Within the function, we built in a check to stop the code if the user tries to withdraw more than the credits they have.

4. Users need to see how many credits they have to play. Smart Contract Function: `get_credits(&self, account_id: AccountId)`

   - Users need to see how much credits they have to play with.

5. Users will need to play. Smart Contract Function: `play(&mut self, coin_side: String)`
   - The core concept of this game.
   - Users pick a coin side, heads or tails and they have a 50% chance of getting it right or wrong.
   - If they get it right, they win 1 NEAR otherwise, they lose that NEAR.
   - We assert that they choose either a heads or tails here otherwise the contract will panick.
   - Frontend will show whether the user won or lose. Frontend keeps a record of this as well.

## Potential Next Steps

While the contract is functional and the frontend is presentable, there are a few modifications that can be made to improve the UI/UX or increased features:

1. Instead of a spinner loading, we can have a GIF of a coinflip and a coin that shows heads or tails dependent on the outcome.
2. Rewrite the smart contract so users have more choices on the betting amount. It is currently only 1 Near each flip.
