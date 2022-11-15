import {program} from 'commander';

import * as anchor from '@project-serum/anchor'; // includes https://solana-labs.github.io/solana-web3.js/
// const { SystemProgram } = anchor.web3; // Added to initialize account
import * as web3 from '@solana/web3.js';
import AnchorClient, * as helper from './helpers.js';

import {APP_CONFIG} from "./config.js";
import { BN } from 'bn.js';
import { bs58, utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes/index.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ASSOCIATED_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token.js';
import * as spl from '@solana/spl-token';
import { getMint } from '@solana/spl-token';
import { transfer } from '@solana/spl-token';
import { transferChecked } from '@solana/spl-token';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

import * as fs from 'fs'
/**
 * @type {AnchorClient}
 */
 let anchorClient
 /**
  * @type {web3.Keypair}
 */
 let wallet;

createCommand('init-session')
    .argument("<session_id>")
    .argument("<max_entrants>")
    .argument("<max_paid_tickets>")
    .action(async function(session_id,max_entrants,max_paid_tickets){

    session_id = parseInt(session_id)

    let entrants = web3.Keypair.generate()
    // let e =  web3.Keypair.generate()
    let space_needed = max_entrants*6; // 32 bytes / publickey
    let payment_token_mint = APP_CONFIG.network=="devnet"? 
        new web3.PublicKey("9m1AUciQjityTXiqPnV1KyVZK2dzVAxFxdSVSNeJhosX"): // USDC dummy | minted by self
        // new web3.PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"): // USDC devnet
        new web3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"); //USDC localnet/mainnet

    let team_treasury = new web3.PublicKey("6rhreNsCWgcLha4AViLwHGBV9vKCw6wVi486SYf6JLvR") // test treasruy
    // let session_treasury = 
    let max_paid_tickets_per_entrants = max_paid_tickets;
    let max_free_tickets_per_entrants = 1;
    let price_per_ticket = 1 * 1e6; //USDC 

    let start_timestamp = new Date("24 feb 2019 12:00 GMT"); // convertng to epoch timestamp
    console.log(Date.parse(start_timestamp)/1000|0)
    let end_timestamp = new Date()
    end_timestamp = end_timestamp.setDate(end_timestamp.getDate() + 5)/1000 | 0
    start_timestamp = Date.parse(start_timestamp)/1000|0

    // console.log(start_timestamp,end_timestamp)
    // return
    await createAccount(entrants,space_needed)

    console.log("session_id:",session_id)
    // new BN(session_id).toBuffer('le',8)
    let tx = await anchorClient.program.methods.initPotSession(

            new BN(session_id),
            new BN(max_entrants),
            new BN(start_timestamp),
            new BN(end_timestamp),
            new BN(max_paid_tickets_per_entrants),
            new BN(max_free_tickets_per_entrants),
            new BN(price_per_ticket),

        ).accounts(
        {
            entrants:entrants.publicKey,
            paymentTokenMint:payment_token_mint,
            payer:wallet.publicKey,
        }
    ).signers([wallet]);

    let pdas = (await tx.pubkeys()).potSessionAcc.toBase58()
    console.log("Pdas:",pdas)
    console.log("Entrants:",entrants.publicKey.toBase58())

    tx = await tx.rpc()

    console.log("Tx:",tx)

})

createCommand("update-session")
    .argument("<session_id>")
    .option("-p,--price <number>")
    .option("-s,--sTS <number>","Start timestamp")
    .option("-e,--eTS <number>","End timestamp")
    .option("-P,--maxPt <number>","Max paid tickets")
    .option("-F,--maxFt <number>","Max free tickets")
    .action(async (session_id,opts)=>{
        let session_acc = (await getSessionAccountById(session_id));

        console.log(opts)
        console.log(session_acc.account)
        // new BN().
        const sTS = opts.sTS? opts.sTS : session_acc.account.startTimestamp.toNumber();
        const eTS = opts.eTS ? opts.eTS : session_acc.account.endTimestamp.toNumber();
        const maxPt = opts.maxPt ? opts.maxPt : session_acc.account.maxPaidTicketsPerEntrant
        const maxFt = opts.maxFt ? opts.maxFt : session_acc.account.maxFreeTicketsPerEntrant
        const price = opts.price ? opts.price : session_acc.account.pricePerTicket.toNumber()
        // return

        console.log(
            session_id,
            sTS,
            eTS,
            maxPt,
            maxFt,
            price
        )
        let tx  = anchorClient.program.methods.updatePotSession(
            new BN(parseInt(session_id)),
            new BN(parseInt(sTS)),
            new BN(parseInt(eTS)),
            new BN(parseInt(maxPt)),
            new BN(parseInt(maxFt)),
            new BN(parseInt(price))
        ).accounts({
            potSessionAcc:session_acc.publicKey
        }
        )
        .signers([
            wallet
        ])

        let pdas = (await tx.pubkeys()).potSessionAcc.toBase58()
        console.log(pdas,session_acc.publicKey.toBase58())
        tx = await tx.rpc()
        console.log("Update success: ",tx)
    })

createCommand("buy-ticket").argument("<session_id>").action(async function(session_id){
    let session_acc = (await getSessionAccountById(session_id));
    let payment_token_mint = session_acc.account.paymentTokenMint;
    let entrants = session_acc.account.entrants;
    let team_treasury = new web3.PublicKey("6rhreNsCWgcLha4AViLwHGBV9vKCw6wVi486SYf6JLvR")
    let team_treasury_assc_acc = await getAssociatedTokenAddress(
        payment_token_mint,
        team_treasury,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_PROGRAM_ID
    );
    let buyer_token_acc = await getAssociatedTokenAddress(
        payment_token_mint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_PROGRAM_ID
    )

    // console.log(session_acc)
    // return
    // console.log(team_treasury_assc_acc)
    console.log("Assc accounts = Team:",team_treasury_assc_acc.toBase58(),"Buyer:",buyer_token_acc.toBase58())
    let tx = anchorClient.program.methods.buyTicket(
        new BN(session_id,'le'),
        new BN(1,'le') // quantity

        // Buffer.from(anchor.utils.bytes.utf8.encode("hey")), //identifier
        // Buffer.from(anchor.utils.bytes.utf8.encode("hey")) // invite code
    ).accounts(
        {
            potSessionAcc:session_acc.publicKey,
            buyerTokenAccount:buyer_token_acc,
            paymentTokenMint:payment_token_mint,
            entrants:entrants,
            teamTreasuryAssociatedAccount:team_treasury_assc_acc,

            payer:wallet.publicKey,
        }
    ).signers([wallet]);

    // console.log("passws")
    console.log("pdas Useraccount:",(await tx.pubkeys()).userAccount.toBase58())

    // console.log()
    tx = await tx.rpc();
    console.log("tx:",tx)
    
})
createCommand("show-session").argument("<session_id>").action(async function(session_id){
     /**
     * @type {web3.GetProgramAccountsFilter}
     */
      let filter = {
        memcmp:{
            offset: 8, // disc + ...
            bytes: bs58.encode((new BN(session_id, 'le')).toArray())
        }
    }
    
    let accounts = await anchorClient.program.account.potSession.all([filter])
    let data = accounts[0].account
    
    console.log(accounts[0].account)
    console.log("Entrants pubkey:",accounts[0].account.entrants.toBase58())
    let entrants = await anchorClient.program.account.entrants.fetch(accounts[0].account.entrants);

    
    console.log(`
        SESSION: ${data.sessionId} ,
        SESSION KEY: ${accounts[0].publicKey.toBase58()},
        Start: ${data.startTimestamp.toString()},
        End : ${data.endTimestamp.toString()} 
        Entrants Total: ${entrants.total}
        Entrants Max: ${entrants.max} 
        maxPaidTicketsPerEntrant: ${data.maxPaidTicketsPerEntrant} 
        maxFreeTickets: ${data.maxFreeTicketsPerEntrant}
        creator: ${data.creator.toBase58()},
        paymentTokenMint: ${data.paymentTokenMint.toBase58()}
        pricePerTIcket: ${data.pricePerTicket.toNumber()},
        winner: ${data.winner}
    `)
    // console.log("Entrants:",entrants)
    // accounts[0].entrants;



    // console.log(accounts[0].account.startTimestamp.toString())
    // console.log(accounts[0].publicKey.toBase58())

    /* const bank = new web3.PublicKey("DfUS3EDKQ8Yk8114ZiFqEMVGtHd6GUXi5kSGNSXnXcFY")
    const creator = new web3.PublicKey("DeL18xUwGLbyTrAwt8Ly9rAkvHGBw6xD8FMS7exbQxoP")
    const farm = new web3.PublicKey("3g1Nb4tZfadW4gKYnG8KEjmYKUfWEzLnr9CEXPcKLAaW")
    let add= await web3.PublicKey.findProgramAddress(
        [Buffer.from('vault'), bank.toBytes(), creator.toBytes()],
        new web3.PublicKey(
            'bankHHdqMuaaST4qQk6mkzxGeKPHWmqdgor6Gs8r88m'
          )
      );

    let f = await web3.PublicKey.findProgramAddress(
        [Buffer.from('farmer'), farm.toBytes(), creator.toBytes()],
        new web3.PublicKey("farmL4xeBFVXJqtfxCzU9b28QACM7E2W2ctT6epAjvE")
      );

    console.log(add[0].toBase58(),f[0].toBase58()) */
    // console.log(JSON.stringify(accounts))

})

createCommand("show-user").argument("<session_id>").action(async function(session_id){
    let session_acc = await getSessionAccountById(session_id)

    // console.log(session_id,            new BN(parseInt(session_id)).toArrayLike(Buffer,'le',8),
    // )
    let sess_seed =Buffer.alloc(2)
    sess_seed.writeUInt16LE(session_id)
    let [session,_a] = await web3.PublicKey.findProgramAddress(
        [
            Buffer.from("pot_session_acc"),
            sess_seed,//.toArrayLike(Buffer,'le',8),
            wallet.publicKey.toBuffer()

        ],
        anchorClient.program.programId,
    );

    console.log(session.toBase58())
    // 2gdj1Toudb1cojLZoyXP3WxXCxVQ6tUhUyP4xyggVGgD

    // return
    let user_seed = Buffer.alloc(2)
    user_seed.writeUInt16LE(session_id)
    let [user_acc,_b] = await web3.PublicKey.findProgramAddress(
        [
            Buffer.from("pot_user_account"),
            user_seed,
            wallet.publicKey.toBuffer(),
        ],
        
        anchorClient.program.programId
    )

    // user_acc = new web3.PublicKey("E6eXgWJ7XUKhF7phN5qqViCUhofBcPrSseH4hgqZLoxL")
    console.log("pid:",anchorClient.program.programId.toBase58());
    console.log("user account:",user_acc.toBase58())
    // return
    let data = await anchorClient.program.account.userAccount.fetch(user_acc)
    
    console.log(data)

})

createCommand("dump-entrants").argument("<session_id>").action(async function(session_id){
    let session_acc = await getSessionAccountById(session_id)
    
    // let bb = "3VqwFviPBqG9znZa2rfh4skQ2QbU81vLrXbYQqwgiti4".slice(0,6);
    // let bc = bs58.encode(Buffer.from(bb));
    // console.log(bb,bc,bs58.decode(bc));

    // return
    let entrants = session_acc.account.entrants
    let entrants_info = await anchorClient.program.account.entrants.fetch(entrants);

    console.log("entrant key:",entrants.toBase58(),entrants_info.total);

    const ENTRANT_SIZE = 6;
    let data = await anchorClient.connection.getAccountInfo(entrants)


    let sliced_data = data.data.slice(16,16+ENTRANT_SIZE*entrants_info.total).toString();
    
    for(let i = 0; i<  ENTRANT_SIZE*entrants_info.total;i+=ENTRANT_SIZE){
        console.log(sliced_data.slice(i,i+ENTRANT_SIZE));
    }
    // Buffer.from('','hex').readDoubleBE(0)
    return
    let occurences = {}
    for(let i=ENTRANT_SIZE; i<ENTRANT_SIZE*entrants_info.total; i+=ENTRANT_SIZE){
        let slice = data.data.slice(i,i+ENTRANT_SIZE);

        let addr = bs58.encode(slice)
        

        console.log(addr)
    }

    // console.log(entrants_info)
    console.log(sliced_data)
    // console.log(data)

})

createCommand("get-inviter").argument("<session_id>").argument('<invite_code>').action(async function(session_id,invite_code){

    
    let filter = {
        memcmp:{
            offset: 8+(1+32)+4, // disc + ...
            bytes: bs58.encode(Buffer.concat(
                [
                    Buffer.from(utf8.encode(invite_code)),
                    (new BN(session_id, 'le')).toBuffer()
                ]
                )
            )
        }
    }
    try{

        let data = await anchorClient.program.account.userAccount.all([filter])

        
        console.log(data[0].publicKey.toBase58())
    }
    catch(e){
        console.log(e)

    }

})

createCommand("close-user").argument("<session_id>").argument('<user_pubkey>').action(async function(session_id,user_pubkey){

    let tx = await anchorClient.program.methods.closeUserAccount(
        new BN(session_id,'le'),
    ).accounts({

        user:new web3.PublicKey(user_pubkey),
        payer:wallet.publicKey,
    }
    ).signers([
        wallet
    ]).rpc();

    console.log(tx)
})


createCommand("reveal-winner").argument("<session_id>").action(async function(session_id){

    let session = await getSessionAccountById(session_id)
    let entrants = session.account.entrants;
    // let recent_block_hash = await anchorClient.connection.getLatestBlockhash()
    
    // console.log(recent_block_hash)
    // return
    let tx = await anchorClient.program.methods.revealWinner(
        new BN(session_id,'le'),
    ).accounts({
        entrants:entrants,
        recentBlockhashes:web3.SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        payer:wallet.publicKey

    }).rpc()

    console.log(tx)
})

createCommand("claim-prize").argument("<session_id>").action(async function(session_id){

    let session = await getSessionAccountById(session_id);
    const paymentTokenMint = session.account.paymentTokenMint;

        // account to recieve the proceedings
        const recieverAsscAccount = await getOrCreateAssociatedTokenAccount(
            anchorClient.connection,
            this.wallet,
            paymentTokenMint,
            wallet.publicKey,
        );

    let tx = await anchorClient.program.methods.claimPrize().accounts(
        {
            potSessionAcc:session.publicKey,
            paymentTokenMint:paymentTokenMint,
            buyerTokenAccount:recieverAsscAccount.address,
            payer:wallet.publicKey,
        }
    ).rpc();

    console.log(tx)

})
createCommand("create-account").argument("<space_needed>").action(space=>{
    let acc =  web3.Keypair.generate()

    console.log("acc:",acc.publicKey.toBase58())
    createAccount(acc,parseInt(space)*32)

})

createCommand("test").action(async ()=>{

    let winner = "6jrbcg6S3aeoovyWkZsE1tqtt7rq3z7MA2NnbYbjPQKL";
    let invite_code = winner.toString().slice(0,6);
    invite_code = bs58.encode(new TextEncoder().encode(invite_code));

    console.log(invite_code)
    let filter = {
        memcmp:{
            offset: 8+2+32+1+4, // disc + ...
            bytes: invite_code
        }
    };
    let accs = await anchorClient.program.account.potSession.all([filter]);

    console.log(accs)
    return accs;


    let pubkeys = [...new Array(100000)].map(()=>{
        return  web3.Keypair.generate().publicKey.toString().slice(0,6)
    })

    let sett = new Set(pubkeys)
    console.log(pubkeys.length,sett.size)
})


createCommand("transfer-tokens").argument("<mint>").argument("<amount>").requiredOption("-p --payer <path>").action(async (mint,amount,opts)=>{
    // console.log(mint,amount,payer)
    let connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    let mintKey  = new web3.PublicKey(mint)
    let payerWallet = helper.loadWalletKey(opts.payer)

    console.log(mintKey.toBase58())
    let source = await getAssociatedTokenAddress(
        payerWallet.publicKey,
        mintKey
    );
    let reciever = await getOrCreateAssociatedTokenAccount(
        anchorClient.connection,
        payerWallet,
        mintKey,
        wallet.publicKey,
    );

    
    // console.log("Receiver:",reciever.address.toBase58())
    let mintAcc = await getMint(
        anchorClient.connection,
        mintKey,
    ) 
    amount *=Math.pow(10,mintAcc.decimals);

    
    // associate
    let tx = await transferChecked(
        connection,
        payerWallet, //payer
        source, 
        mintKey,
        reciever.address,
        payerWallet, // owner
        amount,
        mintAcc.decimals
    )

    console.log("transfer success:",tx)
    
    
    // console.log(mintAcc)
    // spl.Token.

})
// parsing the commands
program.parse() 

async function getSessionAccountById(session_id){
    let filter = {
        memcmp:{
            offset: 8, // disc + ...
            bytes: bs58.encode((new BN(session_id, 'le')).toArray())
        }
    }
    
    
    let accounts = await anchorClient.program.account.potSession.all([filter])
    return accounts[0]
    // console.log(accounts[0].account)
}

/**
 * NOTE: Things to remeber for using zero account
 * 
 * 1. Need to create a account from js; cpi calls use init that can only create accounts <=10KB
 * 2. The created account should be owned by the contract/program; [set programId while creating the account]
 * 3. The fees is taken from the wallet that's creating the account
 */
async function createAccount(account_keypair,space_needed){

    space_needed += 8 // adding discriminator space

    
    const createAccountParams = {
        fromPubkey: wallet.publicKey,
        newAccountPubkey: account_keypair.publicKey,
        lamports: await anchorClient.connection.getMinimumBalanceForRentExemption(space_needed),
        space: space_needed,
        programId: anchorClient.program.programId 
        // programId: web3.SystemProgram.programId,
    };
    let tx = new web3.Transaction().add(
        web3.SystemProgram.createAccount(createAccountParams)
    )
    let sig = await web3.sendAndConfirmTransaction(anchorClient.connection, tx, [wallet,account_keypair])

    console.log(sig)
}


function createCommand(command){
    return program.name("chub")
        .command(command)
        .option('-r --rpc <devnet|mainnet|localnet>',"","localnet")
        .requiredOption("-k --keypair <path>")
        .hook("preAction",(thisCommand,actionCommand) => {
            let keypairPath = thisCommand.opts().keypair;
            let rpc = thisCommand.opts().rpc;
            wallet = helper.loadWalletKey(keypairPath);
            // console.log(keypairPath)
            const RPC = {
                localnet:"http://127.0.0.1:8899",
                devnet:web3.clusterApiUrl('devnet'),
                mainnet:web3.clusterApiUrl('mainnet-beta')
            }
            APP_CONFIG.network = rpc;
            APP_CONFIG.rpcEndpoint = RPC[rpc]
            anchorClient = helper.initAnchorClient(keypairPath,APP_CONFIG);
        });
}