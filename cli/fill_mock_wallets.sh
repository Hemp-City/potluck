TTW="./test-team-treasury.json"
TW="./test-wallet.json"

echo "airdropn to test wallets."
solana airdrop 1 -k $TTW
solana airdrop 1 -k $TW
#transfer usdc

echo $(solana address -k $TTW)
echo "funding spl to test wallets"
spl-token transfer EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 1 $(solana address -k $TTW) --fund-recipient
spl-token transfer EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 10 $(solana address -k $TW) --fund-recipient

echo "Airdrop to hot wallets"
solana airdrop 10 B2wjnGwsx26fRM6qYKKCMd2inHygfw84EnM3wUmic6dj
solana airdrop 10 6jrbcg6S3aeoovyWkZsE1tqtt7rq3z7MA2NnbYbjPQKL
echo "Funding spl to hot wallets.."
spl-token transfer EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 50 B2wjnGwsx26fRM6qYKKCMd2inHygfw84EnM3wUmic6dj --fund-recipient
spl-token transfer EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 50 6jrbcg6S3aeoovyWkZsE1tqtt7rq3z7MA2NnbYbjPQKL --fund-recipient
echo "Deploying program!"
anchor build && anchor deploy


