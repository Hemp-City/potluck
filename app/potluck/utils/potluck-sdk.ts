import {IDL} from './types/potluck';
import * as idlJson from '../../../target/idl/potluck.json';

import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { bs58, utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { BN } from 'bn.js';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { getAccount, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { AnchorError, ProgramError } from '@project-serum/anchor';
// import { Wallet } from '@project-serum/anchor/dist/cjs/provider';

export class PotluckSDK {
    wallet:any;
    connection?: anchor.web3.Connection;
    provider?: anchor.AnchorProvider;
    // program: any;
    sessionId:number ;

    entrantsData: any;
    sessionInfo:any;
    program?: anchor.Program<any>;
    userAccount:any;

    errorsMap:any;

    // anchorClient : AnchorCli
    constructor(sessionId:number) {
        // process.env.
        
        /**
         * Initializing the anchor program
         */
        // this.wallet = wallet;
        const dummyWallet = anchor.web3.Keypair.generate()

        this.sessionId = sessionId;

        this.initAchorClient( dummyWallet )

        // IDL.errors.forEach((val)=>{
        //     this.errorsMap[val.name] = val;
        // })
        // this.errorsMap = new Map<number,string>( IDL.errors.map(val=>[val.code,val.name]))

        
        // this.initSession()
        // this.wallet?.signTransaction()
        
    }

    initAchorClient = (wallet: any) => {
        // this.wallet = wallet;
        // console.log(process.env)
        const ep = {
            "local":"http://localhost:8899",
            "devnet":"https://api.devnet.solana.com",
            "mainnet":"https://mainnet.com"
        }
        this.connection = new Connection(
             process.env.NEXT_PUBLIC_devMode?
                (process.env.NEXT_PUBLIC_NETWORK == "DEVNET" ? ep.devnet:ep.local) : ep.mainnet
        )
        this.provider = new anchor.AnchorProvider(
            this.connection, 
            wallet,
            {
                // commitment:"processed",
                preflightCommitment:"recent"
            }
            );

        this.program = new anchor.Program(IDL, process.env.NEXT_PUBLIC_PROGRAM_ID!, this.provider);

    }
     setWallet = (_wallet:any) => {

        // console.log("set wallet:",_wallet)
        this.wallet = _wallet;
        this.initAchorClient(_wallet)
    } 

    /**
     * Use buy ticket to buy the ticket
     * 
     * 1. Pass the inviter account in remaining accounts of 'ix' for referral
     * @param invite_code 
     */

    buyTicket = async (quantity:number,invite_code?:string) =>{
        // let session_acc = (await getSessionAccountById(session_id));
            //  return

        if (this.wallet == undefined){
            throw Error(PotluckErrors.WalletNotConnected);
        }

        // check for the user account limit reached or not on client side and show error before hitting the contract
        // this.userAccount got all the data

        // return 0;
        let paymentTokenMint = this.sessionInfo.account.paymentTokenMint;
        let entrants = this.sessionInfo.account.entrants;
        // return
        let teamTreasury = new anchor.web3.PublicKey(
            process.env.NEXT_PUBLIC_devMode ? 
            process.env.NEXT_PUBLIC_DEV_TEAM_TREASURY! : 
            process.env.NEXT_PUBLIC_PROD_TEAM_TREASURY!
            );
            
        let teamTreasuryAssociatedAccount = await getAssociatedTokenAddress(
            paymentTokenMint,
            teamTreasury,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_PROGRAM_ID
        );
        let buyerTokenAccountAddress = await getAssociatedTokenAddress(
            paymentTokenMint,
            this.wallet.publicKey,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_PROGRAM_ID
        );
        // console.log(buyerTokenAccountAddress.toBase58())
        let buyTokenAccount ;
        try{

            // check for enough balance in buyer token account
             buyTokenAccount = await getAccount(
                this.connection!,
                buyerTokenAccountAddress
                );
                
                
                // check if the buyer account contains enough balance, if not throws error
                // console.log(buyTokenAccount.amount.valueOf(),this.sessionInfo.account.pricePerTicket.toNumber())
                if(buyTokenAccount.amount < this.sessionInfo.account.pricePerTicket.toNumber()){
                    throw Error(PotluckErrors.InsufficientBalance);
                }
        }
        catch(e){
            //TODO:Throw an error to the user for this
            throw Error(PotluckErrors.USDCAccountNotFound)
        }

        let remainingAccounts = invite_code? [
            //fetch inviters account
            {
                pubkey: await this.getInvitersAccount(invite_code),
                isSigner:false,
                isWritable:true,
            }
        ] : [];

        
        // console.log("Invite code:",invite_code,"Type:",typeof(invite_code),remainingAccounts);

        let ix = this.program!.methods.buyTicket(
            new BN(this.sessionId!,'le'),
            new BN(quantity,'le') // quantity

            // Buffer.from(anchor.utils.bytes.utf8.encode("hey")), //identifier
            // Buffer.from(anchor.utils.bytes.utf8.encode("hey")) // invite code
        )
        .accounts(
            {
                potSessionAcc:                  this.sessionInfo.publicKey,
                buyerTokenAccount:              buyerTokenAccountAddress,
                paymentTokenMint:               paymentTokenMint,
                entrants:                       entrants,
                teamTreasuryAssociatedAccount:  teamTreasuryAssociatedAccount,
                payer:                           this.wallet.publicKey,
            }
        )
        // .signers([this.wallet.])
        // pass the inviters user account in the remaining accounts
        .remainingAccounts(
            remainingAccounts
        );

        // if the keypair is provided use this
        /* if(this.wallet instanceof anchor.Wallet){
            ix = ix.signers([
                this.wallet as anchor.Wallet
            ])
        } */

        let pda = await ix.pubkeys()
        // console.log("Useraccount:",pda.userAccount?.toBase58())


        let tx = await ix.rpc();
        console.log("tx:",tx)

        return tx;
    }

    /**
     * Get user account
     * @returns 
     */
    getUserAccount = async ()=> {
        if(this.wallet == undefined){
            return Error(PotluckErrors.WalletNotConnected);
        }
        let userAccountSeed = Buffer.alloc(2)
        userAccountSeed.writeUInt16LE(this.sessionId)
        let [userAccountPDA,_] = await anchor.web3.PublicKey.findProgramAddress(
            [
                Buffer.from("pot_user_account"),
                userAccountSeed,
                this.wallet.publicKey.toBuffer(),
            ],
            
            this.program!.programId
        );

        return await this.program!.account.userAccount.fetchNullable(userAccountPDA)
        // return this.userAccount
    }
    /**
     * Init sessionInfo and entrants
     */
    initSession = async (walletConnected:boolean = false) => {

        // console.log("init session called")
        if(this.sessionId){
            this.sessionInfo = await this.getSessionInfo(this.sessionId);
            
            if(this.sessionInfo){

                this.entrantsData = await this.getEntrantsInfo(this.sessionInfo.account.entrants)
            }
            
            if(walletConnected){
                this.userAccount = await this.getUserAccount()

                // console.log("fetched useraccount:",this.userAccount)
            }
            
            // console.log("set session info",this.sessionInfo)
            // console.log("set entrants data",this.entrantsData)
        }
        // console.log("SI:",this.sessionInfo)
    }

    /**
     * Fetch session info from the chain
     * @param sessionId 
     * @returns 
     */
    getSessionInfo = async (sessionId:number) =>{
        
        let filter = {
            memcmp:{
                offset: 8, // disc + ...
                bytes: bs58.encode((new BN(sessionId, 'le')).toArray())
            }
        }
        try{

            let session = (await this.program!.account.potSession.all([filter]))[0]
            return session
        }
        catch(e){
            throw Error(PotluckErrors.SessionNotFound)
        }
        // let entrants = await this.program.account.entrants.fetch(session.account.entrants);

    }

    getInvitersAccount = async (invite_code:string) =>{
        
        let filter = {
            memcmp:{
                offset: 8+(1+32)+4, // disc + ...
                bytes: bs58.encode(Buffer.concat(
                    [
                        Buffer.from(utf8.encode(invite_code)),
                        (new BN(this.sessionId, 'le')).toArrayLike(Buffer)
                    ]
                    )
                )
            }
        };
        // return 1;

        // this.program?.account.
        let data = await this.program?.account.userAccount.all([filter])
        if(data==undefined || data?.length==0 ){
            throw Error(PotluckErrors.InvalidInviteCode)
        }
        return data![0].publicKey;    
    }
    getPricePerTicket = () =>{

        // TODO: If using tokens other than USDC make sure to get the decimals
        return this.sessionInfo.account.pricePerTicket / 1000_000 // USDC has 6 decimals
    }

    getPotValue = () =>{

    }

    getEstimatedPrize = () =>{
        // total tickets * price per ticket - 10% team treasury
        return this.entrantsData.max * this.getPricePerTicket();
    }

    parseError = (err:any) =>{

        // return AnchorError.parse(err,this.errorsMap);
    }
    /**
     * Get the entrants info for max and total entrants
     * @param entrantsAccount 
     * @returns 
     */
    getEntrantsInfo = async (entrantsAccount: anchor.Address)=>{
        try{

            return await this.program!.account.entrants.fetch(entrantsAccount);
        }
        catch(e){
            throw Error(PotluckErrors.SessionNotFound)
        }
    }

    getUserAccounts = async (owner:PublicKey)=>{

        let filter = {
            memcmp:{
                offset: 8+1, // disc + ...
                bytes: owner.toBase58()
            }
        };
        let accs = await this.program?.account.userAccount.all([filter]);

        // console.log("accounts:",accs)
    }

    checkIsWinner = async (winner:PublicKey)=>{
        let filter = {
            memcmp:{
                offset: 8+2+32+1, // disc + ...
                bytes: winner.toBase58()
            }
        };
        let accs = await this.program?.account.potSession.all([filter]);
        return accs;
        // console.log("winner:",accs)
    }

    claimPrize = async (session:any)=>{

        if(!this.program) throw Error(PotluckErrors.UndefinedSDK);

        const sessionKey = session.publicKey
        let userAccountSeed = Buffer.alloc(2)
        userAccountSeed.writeUInt16LE(this.sessionId)

        // pass the bump to the ix, required for signing the token transfer
        let [_,sessionBump] = await PublicKey.findProgramAddress([
            Buffer.from("pot_session_acc"),
            userAccountSeed,
            session.account.creator.toBuffer()

        ],
            this.program.programId
        );

        const paymentTokenMint = session.account.paymentTokenMint;

        // account to recieve the proceedings
        const recieverAsscAccount = await getOrCreateAssociatedTokenAccount(
            this.connection!,
            this.wallet,
            paymentTokenMint,
            this.wallet.publicKey,
        );

        let tx = await this.program?.methods.claimPrize(
            new BN(sessionBump,'le')
        ).accounts(
            {
                potSessionAcc:sessionKey,
                paymentTokenMint:paymentTokenMint,
                buyerTokenAccount:recieverAsscAccount.address,
                sessionTreasury:session.account.sessionTreasury,
                payer:this.wallet.publicKey,
            }
        ).rpc();


        // let pub = await tx?.pubkeys()
        // console.log("claim prize",pub?.sessionTreasury?.toBase58());
        return tx;
    }
    

}

export const PotluckErrors = {
    InsufficientBalance : "Insufficient balance",
    USDCAccountNotFound:"USDC account not found",
    WalletNotConnected : "Wallet not connected",
    SessionNotFound:"Session not found",
    InvalidInviteCode:"Invalid invite code or not found",
    UndefinedSDK:"Undefined SDK",

}