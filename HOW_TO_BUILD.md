# DevExtreme Vue. How to Build an Application

## DevExtreme Submodule

Since we store the generated code in this repository, you need to commit a version of `devextreme` that is compatible with it.
We use `git-submodule` to keep the versions of `devextreme` and `devextreme-vue` in sync.

After you clone the `devextreme-vue` repository, use the following command to load the `devextreme` submodule:

    npm run restore-submodule

This command also resets all changes in the submodule, if any occur.

To get the latest `devextreme` commits, update the submodule:

    npm run pull-devextreme

After that, generate the code (see the last paragraph) and commit the changes in the submodule file.

## Link DevExtreme Modules

To install the latest version of `devextreme` in the `node_modules` folder, run the following command:

    npm run link-devextreme

## Local DevExtreme Fork

If you need to use your fork of `devextreme` locally instead of a submodule, change the path to `devextreme` in `package.json`, section `config`:

    "config": {
        "devextreme": "./devextreme"
    }

## Generate Code

Generate metadata before code generation:

    npm run generate-metadata

Then, build the packages:

    npm run build:packages
