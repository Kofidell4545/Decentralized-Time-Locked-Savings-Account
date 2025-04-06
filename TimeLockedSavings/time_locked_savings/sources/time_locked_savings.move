module time_locked_savings::savings_account {
    use sui::object::{Self, ID, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::event;

    /// Error codes
    const ELockedFundsNotMatured: u64 = 1;
    const EOwnerMismatch: u64 = 2;

    /// Event emitted when a new savings account is created
    struct SavingsAccountCreated has copy, drop {
        id: ID,
        owner: address,
        unlock_time: u64,
        amount: u64
    }

    /// Event emitted when funds are withdrawn
    struct FundsWithdrawn has copy, drop {
        id: ID,
        amount: u64
    }

    /// Time-locked savings account that holds SUI coins
    struct SavingsAccount has key, store {
        id: UID,
        owner: address,
        unlock_time: u64,
        coins: Coin<SUI>
    }

    /// Create a new savings account with locked funds until the specified time
    public entry fun create_savings_account(
        coin: Coin<SUI>,
        lock_duration_seconds: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(clock) / 1000; // Convert ms to seconds
        let unlock_time = current_time + lock_duration_seconds;
        let owner = tx_context::sender(ctx);
        let amount = coin::value(&coin);

        let savings_account = SavingsAccount {
            id: object::new(ctx),
            owner,
            unlock_time,
            coins: coin
        };

        // Emit creation event
        event::emit(SavingsAccountCreated {
            id: object::id(&savings_account),
            owner,
            unlock_time,
            amount
        });

        // Transfer the account to the owner
        transfer::transfer(savings_account, owner);
    }

    /// Withdraw funds if the lock period has expired
    public entry fun withdraw(
        savings_account: SavingsAccount,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let SavingsAccount { 
            id, 
            owner, 
            unlock_time, 
            coins 
        } = savings_account;

        // Check that the sender is the owner
        let sender = tx_context::sender(ctx);
        assert!(sender == owner, EOwnerMismatch);

        // Check if the lock period has expired
        let current_time = clock::timestamp_ms(clock) / 1000; // Convert ms to seconds
        assert!(current_time >= unlock_time, ELockedFundsNotMatured);

        // Emit withdrawal event
        event::emit(FundsWithdrawn {
            id: object::uid_to_inner(&id),
            amount: coin::value(&coins)
        });

        // Delete the savings account and transfer the coins to the owner
        object::delete(id);
        transfer::public_transfer(coins, owner);
    }

    /// View the details of a savings account
    public fun get_details(savings_account: &SavingsAccount): (address, u64, u64) {
        (
            savings_account.owner,
            savings_account.unlock_time,
            coin::value(&savings_account.coins)
        )
    }

    /// Check if a savings account is mature and ready for withdrawal
    public fun is_mature(savings_account: &SavingsAccount, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock) / 1000; // Convert ms to seconds
        current_time >= savings_account.unlock_time
    }
}