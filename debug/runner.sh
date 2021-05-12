#!/bin/sh

# Usage: ./run.sh [contract] [hex args]

target='0x095e7baea6a6c7c4c2dfeb977efac326af552d87'
bin=$(eas $1)

rm -f trace-0-*
cat debug/base.json |
				jq ".alloc[\"$target\"].code = \"0x$bin\"" |
				jq ".txs[0].input = \"$2\"" |
				evm t8n --input.alloc=stdin --input.env=stdin --input.txs=stdin --output.result=stdout --output.alloc=stdout --trace
traceview trace-0-*
rm -f trace-0-*
