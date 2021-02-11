; Read the calldata into memory.
calldatasize					; [calldatasize]
push1 0						; [calldatasize, calldata_ptr]
dup1						; [calldatasize, calldata_ptr, mem_ptr]
calldatacopy					; []

; Extract only the function selector
push1 0						; [selector_ptr]
mload           				; [dirty_selector]
push1 e0					; [dirty_selector, 28*8]
shr		      				; [selector]

; Jump to the coresponding function.
dup1						; [selector, selector]
push4 selector("decimals()")			; [selector, selector, decimals]
eq						; [selector, is_decimals]
push4 .decimals					; [selector, is_decimals, .decimals]
jumpi						; [selector]

dup1						; [selector, selector]
push4 selector("totalSupply()")			; [selector, selector, total_supply]
eq						; [selector, is_total_supply]
push4 .total_supply				; [selector, is_total_supply, .total_supply]
jumpi						; [selector]

dup1						; [selector, selector]
push4 selector("balanceOf(address)")		; [selector, selector, balance_of]
eq						; [selector, is_balance_of]
push4 .balance_of				; [selector, is_balance_of, .balance_of]
jumpi						; [selector]

dup1						; [selector, selector]
push4 selector("transfer(address, uint256)")	; [selector, selector, transfer]
eq						; [selector, is_transfer]
push4 .transfer 				; [selector, is_transfer, .transfer]
jumpi						; [selector]

dup1						; [selector, selector]
push4 selector("transferFrom(address, address, uint256)") ; [selector, selector, transfer_from]
eq						; [selector, is_transfer_from]
push4 .transfer_from				; [selector, is_transfer_from, .transfer_from]
jumpi						; [selector]

; Catchall for reverts.
jumpdest .failure
push1 0						; [selector, revert_data_ptr]
push1 0						; [selector, revert_data_ptr, revert_data_len]
revert

; BalanceOf implementation
jumpdest .balance_of
pop						; []
push1 4						; [address_ptr]
mload						; [address]
sload						; [balance]
push1 0						; [balance, balance_ptr]
swap1						; [balance_ptr, balance]
dup2						; [balance_ptr, balance, balance_ptr]
mstore						; [balance_ptr]
push1 20					; [balance_ptr, balance_len]
return						; []

; Transfer implementation
jumpdest .transfer
pop						; []
caller						; [from]
sload						; [balance]
push1 24					; [balance, amount_ptr]
mload						; [balance, amount]
dup2						; [balance, amount, balance]
dup2						; [balance, amount, balance, amount]
gt						; [balance, amount, is_balance_enough]
push4 .failure					; [balance, amount, is_balance_enough, failure_dst]
jumpi						; [balance, amount]
dup1						; [balance, amount, amount]
swap2						; [amount, balance, amount]
swap1						; [amount, amount, balance]
sub						; [amount, new_balance]
caller						; [amount, new_balance, from]
sstore						; [amount]
push1 4						; [amount, to_ptr]
mload						; [amount, to]
dup1						; [amount, to, to]
sload						; [amount, to, balance]
swap1						; [amount, balance, to]
swap2						; [to, balance, amount]
add						; [to, new_balance]
swap1						; [new_balance, to]
sstore						; []
push1 0						; [return_ptr]
dup1						; [return_ptr, return_len]
return						; []

jumpdest .decimals
jumpdest .total_supply
jumpdest .transfer_from
stop
