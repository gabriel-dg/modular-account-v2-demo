# Modular Account V2 Demo

This repository demonstrates how to use Alchemy's Modular Account V2 for Ethereum Account Abstraction.

## What is Account Abstraction?

Account Abstraction enables programmable "smart accounts" that can support features like:
- Social recovery
- Multi-signature wallets
- Session keys
- Spending limits
- Customizable validation logic

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn
```

2. Configure environment variables:
```bash
# Copy the example .env file
cp .env.example .env

# Edit the .env file and add your Alchemy API key
# You can get an Alchemy API key at https://dashboard.alchemy.com
```

Your `.env` file should contain:
```
ALCHEMY_API_KEY=your_alchemy_api_key_here
# The MODULAR_ACCOUNT_PRIVATE_KEY will be generated for you if not provided
```

## Scripts

This demo is split into two scripts for clarity:

### 1. Calculate Smart Account Address

```bash
npx tsx get-account-address.ts
```

This script will:
- Use an existing private key from your `.env` file (if available)
- Or generate a new private key automatically if none exists
- Calculate the corresponding Modular Account V2 address
- Display the address that needs to be funded

If a new private key is generated, the script will display it in the console with instructions to add it to your `.env` file for future use.

### 2. Send a User Operation

```bash
npx tsx send-user-op.ts
```

This script will:
- Use the private key from your `.env` file to recreate the account
- Send a User Operation from that account (a basic empty transaction to Vitalik's address by default)
- Display transaction information and Etherscan links to view the result

## Complete Workflow

1. **Set up your environment:**
   - Install dependencies with `npm install` or `yarn`
   - Create a `.env` file with your Alchemy API key

2. **Get your account address:**
   - Run `npx tsx get-account-address.ts`
   - If this is your first time, it will generate a private key for you
   - Copy the displayed private key to your `.env` file as `MODULAR_ACCOUNT_PRIVATE_KEY`

3. **Fund your account:**
   - Copy the Modular Account V2 address displayed by the script
   - Get Sepolia ETH from a faucet like https://sepoliafaucet.com/
   - Send at least 0.0001 ETH to your Modular Account address

4. **Send a user operation:**
   - Run `npx tsx send-user-op.ts`
   - The script will create a transaction from your smart account
   - View the transaction on Sepolia Etherscan using the provided links

## How Address Calculation Works

Modular Account V2 addresses are calculated deterministically based on:
1. The owner/signer address (derived from your private key)
2. The account implementation contract
3. The initialization data
4. A salt value (default is 0n)

The same private key will always produce the same Modular Account address. This enables features like counterfactual deployment (using the account before it's actually deployed on-chain).

## Environment Variables

The project uses the following environment variables:

- `ALCHEMY_API_KEY`: Your Alchemy API key for accessing Ethereum networks
- `MODULAR_ACCOUNT_PRIVATE_KEY`: The private key used to control your smart account (will be generated if not provided)

These are stored in a `.env` file which is not committed to version control for security reasons.

## Security Considerations

1. **Never** commit your `.env` file to version control
2. Keep your private key secure - anyone with access to it can control your account
3. For production applications, consider more secure ways to store private keys
4. Consider using advanced features of Account Abstraction like WebAuthn or multisig for better security

## Generating a New Private Key

If you want to generate a new private key (and therefore a new Modular Account):

1. Simply remove the `MODULAR_ACCOUNT_PRIVATE_KEY` line from your `.env` file
2. Run the script: `npx tsx get-account-address.ts`
3. The script will generate a new key and display it in the console
4. Copy the displayed private key to your `.env` file as `MODULAR_ACCOUNT_PRIVATE_KEY`
5. The new key will generate a different Modular Account address

## Customizing User Operations

To modify what your User Operation does, edit these parameters in `send-user-op.ts`:

```typescript
// The address you want to interact with (Vitalik's address in this example)
const TARGET_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

// The amount of ETH to send (0 for this example)
const ETH_AMOUNT = "0";

// Optional: The data to include in the transaction (empty for this example)
const CALL_DATA = "0x";
```

## Troubleshooting

If you encounter an error like "sender balance and deposit together is 0", it means your account needs to be funded. Make sure to:

1. Run `get-account-address.ts` first to get your account address
2. Fund that address with Sepolia ETH
3. Wait for the transaction to confirm before running `send-user-op.ts`

For other issues, check the error messages which provide specific guidance on what might be wrong. 