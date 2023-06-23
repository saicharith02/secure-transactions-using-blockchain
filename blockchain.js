const verify=require('crypto');
const sha256=require('sha256');
const fs = require('fs');
const handlebars = require('handlebars');
const blockchain = [];
const data=[];
function addTransaction(transaction,signature,publicKey) {
    // verify the signature
    if (verifySignature(transaction, signature,publicKey)) {
        // add the transaction to the blockchain
        blockchain.push(transaction);
        blockchain.forEach(function(elem){
            data.push(elem);
        })
        return data;
} 
else {
        console.log('Invalid signature. Transaction not added to the blockchain.');
    }
}
function verifySignature(transaction, signature,publicKey) {
    // create a hash for the transaction
    const transactionHash = sha256(JSON.stringify(transaction));

    // verify the signature using the public key
    const vf = verify.createVerify('SHA256');
    vf.update(transactionHash);
    return vf.verify(publicKey, signature, 'hex');
}
module.exports = {

    addTransaction,
    verifySignature
};
