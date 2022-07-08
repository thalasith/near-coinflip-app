use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Balance, Promise, collections::{ UnorderedMap }};

// CONSTS

const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000;
const PROB:u8 = 128;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct CoinFlip {
    pub owner_id: AccountId,
    pub credits: UnorderedMap<AccountId, Balance>
}

impl Default for CoinFlip {
    fn default() -> Self {
        panic!("Should be initialized before usage")
    }
}

#[near_bindgen]
impl CoinFlip {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(env::is_valid_account_id(owner_id.as_bytes()), "Invalid owner account");
        assert!(!env::state_exists(), "Already initialized");
        Self { owner_id, credits: UnorderedMap::new(b"credits".to_vec())}
    }

    #[payable]
    pub fn deposit(&mut self) {
        let account_id = env::signer_account_id();
        // println!("Account Id: {}", account_id);
        let deposit = env::attached_deposit();
        // println!("Deposit: {}", deposit);
        let mut credits = self.credits.get(&account_id).unwrap_or(0);
        // println!("Credits: {}", credits);
        credits = credits + deposit;
        self.credits.insert(&account_id, &credits);
        // let credits_2 = self.credits.get(&account_id).unwrap_or(0);
        // println!("Credits (should be 1): {}", credits_2);
    }

    pub fn withdraw(&mut self, withdrawal: u128) {
        let account_id = env::signer_account_id();
        let mut credits = self.credits.get(&account_id).unwrap_or(0);
        credits = credits - withdrawal;
        self.credits.insert(&account_id, &credits);
        Promise::new(account_id).transfer(withdrawal.into());
    }

    //5000000000000000000000000 = 5 Near

    pub fn play(&mut self, coin_side: String) -> bool {
        let account_id = env::signer_account_id();
        let mut credits = self.credits.get(&account_id).unwrap_or(0);
        assert!(credits > 0, "no credits to play");
        credits = credits - ONE_NEAR;

        let rand: u8 = *env::random_seed().get(0).unwrap();

        // let coin_flip: u8 = rand::thread_rng().gen_range(1..=2);
        // if it is equal to 1 and coin_side chosen is heads, player winds
        if (rand < PROB && coin_side == "heads") || (rand >= PROB && coin_side == "tails")  {
            credits = credits + 10 * ONE_NEAR;
            self.credits.insert(&account_id, &credits);
            return true
        } else  {
            self.credits.insert(&account_id, &credits);
            return false
        } 
    }

    // pub fn reset_credits(&mut self) {
    //     let account_id = env::signer_account_id();
    //     let mut credits = self.credits.get(&account_id).unwrap_or(0);
    //     credits = 0;
    //     self.credits.insert()
    // }

    pub fn get_credits(&self, account_id: AccountId) -> u128 {
        self.credits.get(&account_id).unwrap_or(0).into()
    }
}

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use std::convert::TryFrom;
    use near_sdk::AccountId;
    use near_sdk::json_types::U128;
    use near_sdk::{testing_env, VMContext};
    
    fn ntoy(near_amount: u128) -> U128 {
        U128(near_amount * 10u128.pow(24))
    }

    fn get_context() -> VMContext {
        VMContext {
            predecessor_account_id: "alice.testnet".to_string(),
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "bob.testnet".to_string(),
            signer_account_pk: vec![0],
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 19,
            storage_usage: 1000
        }
    }

    #[test]
    fn make_deposit() {
        let mut context = get_context();
        context.attached_deposit = ntoy(1).into();
        testing_env!(context.clone());

        let mut contract = CoinFlip::new(AccountId::try_from(context.current_account_id.clone()).unwrap());
        contract.deposit();

        assert_eq!(contract.get_credits(AccountId::try_from(context.signer_account_id.clone()).unwrap()), ntoy(1).into());
    }

}