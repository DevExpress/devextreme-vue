const parser = require('yargs-parser');
const { execSync } = require('node:child_process');
const path = require('path')

const exec = (command) => {
    return execSync(command, { stdio: 'inherit'})
}

const argv = parser(process.argv.slice(2), { boolean: [ 'local', 'update-submodule' ], default: { } })

const devextremePath = argv.local ? argv.devextremePath : './devextreme';

if (!argv.local) {
    exec('git submodule init');
    exec(`git submodule update ${argv.updateSubmodule ? '--remote' : ''}`);
    exec(`npm i --prefix ${devextremePath}`);
}

exec(`npm run discover-declarations --prefix ${devextremePath}`);
exec(`dx-tools integration-data-generator --js-scripts ${path.join(devextremePath, '/js')} --artifacts  ${path.join(devextremePath, '/artifacts/internal-tools')} --output-path ./packages/devextreme-vue/metadata/integration-data.json --version ${argv.version}`);
