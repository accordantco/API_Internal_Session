# API_Internal_Session
This code's aim is to create a customized API_Session for Sage Intacct. All code is owned and to be used exclusively by Accordant Co, LLC. 

## Where to find it

**Production Build**: [https://accordantco-internal-api.netlify.app/dist/bundle.js](https://accordantco-internal-api.netlify.app/dist/bundle.js)
<br>
**Development Build**: [https://accordantco-dev-internal-api.netlify.app/dist/bundle.js](https://accordantco-dev-internal-api.netlify.app/dist/bundle.js)

## Usage
Add the following script to your Sage Intacct PageScript:
```
<script src="https://accordantco-internal-api.netlify.app/dist/bundle.js"></script>
```

## Contributing
### Clone the Repository
```
> git clone https://github.com/accordantco/API_Internal_Session
> cd API_Internal_Session
> npm install
> git checkout develop
```
### Staging, Committing, & Deploying
After making changes to `src/index.js`, follow these steps:
```
> Create a new folder/directory under `/dist` for your bundle to be created
> Edit `webpack.config.js` under the output path, replace the current folder/directory with the one you just created
> run `npm run build`
```
