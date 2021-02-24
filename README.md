[![Netlify Status](https://api.netlify.com/api/v1/badges/35d361cc-384b-44a4-9097-95e94ecec7a4/deploy-status)](https://app.netlify.com/sites/json-to-bson-map/deploys)

# JSON To BSON App

An app to aid developers to generate Go BSON class maps

## Build Frontend 

Install [parcel](https://parceljs.org/) command line: 

```
npm install -g parcel
```

Build the React application: 

```
npm install 
parcel build ./index.html
```

## Build Netlify Functions

```
cd ./src
GOOS=linux GOARCH=amd64 go build -o ../functions/convert convert.go    
```

## License

This repo is covered under [Apache License 2.0](LICENSE).