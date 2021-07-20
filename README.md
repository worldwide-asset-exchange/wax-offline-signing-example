# WAX Offline Signing

Techniques for signing air-gapped transactions for the WAX blockchain.

See the file `offline-transfer.js` for the most common approach to signing and how to do it offline.

This example uses eosjs and overrides a couple of modules which would otherwise make requests over RPC to get necessary signing data. Namely, the AbiProvider, which retrieves the abi for the contract that is being operated by the transaction being signed, and the AuthorityProvider, which retrieves public keys for the account doing the signing.

ABI's for other contracts can be manually retrieved using the same technique used to get the eosio.token abi, whcih can be seen in the npm scripts command `get-abi`.

## Usage

Install dependencies

```bash
$ npm install
```

Replace `private key goes here` with your private key in the offlin-transfer.js file.

Replace the from and to accounts with accounts you control. The from account mush have a little bit of WAX.

Run

```bash
$ npm run sign
```

The script will give a command to allow you to manually push the transaction.

