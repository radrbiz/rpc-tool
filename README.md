# InfoWeb Tool

This project is a front-end tool for querying data of radard quickly. 

Using this tool, users can query the raw data in JSON format about account, ledger, TX, list of latest ledgers, transactoin details inside a ledger. Moreover, see inside the servers information through server_info page.

It is based on Javascript, packed in a docker. So developers can deploy it on their owned servers easily, and modidy the tool in their favourite style.

Default back-end WebSocket server wss://s2.radarlab.org:5006; backup server: wss://s1.radarlab.org:5006

It's been deployed on RADR InfoWeb, see: https://info.radarlab.org 

## Usage

```sh
yarn
yarn serve
```

## Build

```sh
yarn build
# or
docker-compose build --force-rm build
docker-compose run --rm build sh -c 'yarn && yarn build'
```

## Docker Image

```sh
docker-compose build service
```
