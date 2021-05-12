const Artifactor = require('@truffle/artifactor');
const ethers = require('ethers');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path')

const target_dir = './build';
const contracts_dir = './src';


function main() {
    if (!fs.existsSync(contracts_dir)) {
        console.error(`contracts directory (${contracts_dir}) does not exsit`)
        return
    }

    let bin = compile_asm("ctor.etk");
    let abi = JSON.parse(fs.readFileSync(`${contracts_dir}/token.abi`, 'utf8'));
    abi = abi.map((el) => {
        let fragment = JSON.parse(ethers.utils.Fragment.from(el).format("json"));

        // ethers doesn't set "indexed" to false when it doesn't appear
        // in the fragment - so set it manually
        if (fragment.type == 'event') {
            for (i = 0; i < fragment.inputs.length; i++) {
                if (!('indexed' in fragment.inputs[i])) {
                    fragment.inputs[i].indexed = false;
                }
            }
        }

        return fragment;
    });

    save_artifact("Token", bin, abi);
    
    /*
    let files = fs.readdirSync(contracts_dir);
    files.forEach((file) => {
        let ext = path.extname(file);
        if (ext == '.etk') {
            let bin = compile_asm(file);
            let name = path.basename(file, '.etk');
            let abi_path = path.format({dir: contracts_dir, name: `${name}.abi`});
            let abi = JSON.parse(fs.readFileSync(abi_path, 'utf8'));
            abi = abi.map((el) => {
                return JSON.parse(ethers.utils.Fragment.from(el).format("json"))
            });

            save_artifact(name, bin, abi);
        }
    });
    */
}

function compile_asm(file) {
    return execSync(`eas ${contracts_dir}/${file}`).toString().replace(/(\r\n|\n|\r)/gm, "");
}

function save_artifact(name, bin, abi) {
    const contractData = {
      contractName: name[0].toUpperCase() + name.slice(1),
      abi: abi,
      bytecode: bin,
    };

    if (!fs.existsSync(target_dir)){
      fs.mkdirSync(target_dir);
    }
    const artifactor = new Artifactor(target_dir);
    artifactor.save(contractData);
}

main();
