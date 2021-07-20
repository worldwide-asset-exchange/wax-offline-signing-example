const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { PrivateKey } = require('eosjs/dist/PrivateKey');
const { base64ToBinary } = require('eosjs/dist/eosjs-numeric');
const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');
const chainId = '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4';

const base64Abi = require('./eosio.token.abi.json');

const privateKey = 'private key goes here';
const accountPublicKey = PrivateKey.fromString(privateKey).getPublicKey().toString();
const signatureProvider = new JsSignatureProvider([privateKey]);

// Overriding this prevents eosjs from trying to get the account's public keys over the wire
const authorityProvider = {
  // If you wish to operate contracts other than eosio.token, you will need to decide which abi to offer depending on args content
  getRequiredKeys: async (args) => [accountPublicKey]
};

// Overriding this prevents eosjs from trying to get the contract ABI over the wire
const abiProvider = {
  getRawAbi: async (accountName) => {
    return { abi: base64ToBinary(base64Abi.abi), accountName };
  },
};
const rpc = new JsonRpc('http://never.gets.called', {fetch});
const api = new Api({
  rpc,
  signatureProvider,
  authorityProvider,
  abiProvider,
  chainId,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

const arrayToHex = (data) => {
  let result = '';
  for (const x of data) {
    result += ('00' + x.toString(16)).slice(-2);
  }
  return result;
};

async function run() {
  const res = await api.transact({
    ref_block_num : 47275,
    ref_block_prefix : 1749105025,
    expiration: (new Date(Date.now() + (new Date()).getTimezoneOffset() * 60000 + 30000)),  // 30 second tx expiry
    actions: [{
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{
        actor: 'useraaaaaaaa',
        permission: 'active',
      }],
      data: {
        from: 'useraaaaaaaa',
        to: 'useraaaaaaab',
        quantity: '0.00000001 WAX',
        memo: 'test',
      },
    }]    
  }, {
    broadcast: false,
    sign: true,
  });

  const transaction = {
    signatures: res.signatures,
    compression: false,
    packed_context_free_data: arrayToHex(new Uint8Array(0)),
    packed_trx: arrayToHex(res.serializedTransaction),
  };

  console.log('Broadcast this transaction with something like:');
  console.log(`curl -X POST -d '${JSON.stringify(transaction)}' https://wax.greymass.com/v1/chain/push_transaction`);
}

run();