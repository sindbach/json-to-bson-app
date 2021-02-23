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