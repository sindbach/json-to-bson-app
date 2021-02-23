[![Netlify Status](https://api.netlify.com/api/v1/badges/35d361cc-384b-44a4-9097-95e94ecec7a4/deploy-status)](https://app.netlify.com/sites/romantic-mcclintock-34c356/deploys)


# JSON To BSON App

An app to aid developers to generate Go BSON class maps

## Build Frontend 

Install [parcel](https://parceljs.org/) command line: 

```
npm install -g parcel
```

Build the React application: 

```
cd ./ui/app
npm install 
cd ..
parcel build ./app/index.html
```

## Build Backend

```
cd ./server
go build 
./api
```

## License

This repo is covered under [Apache License 2.0](LICENSE).