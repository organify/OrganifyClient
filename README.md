# Description

Repository for user of Organify application. The website contains information about organic products. 

## Getting Started

This repository talks to BigChainDb and etherum smart contract

### Prerequisites



### Installation

```
npm install
```

#### Troubleshoot for bigchaindb installation

Error about not finding c++ version => run:

```
npm install -g --production windows-build-tools
```

Error: cannot open input file 'C:\OpenSSL-Win64\lib\libeay32.lib' => download [OpenSSL](https://community.brave.com/t/how-to-build-brave-on-windows/10175)

### Run project

```
node server
```
### Deploy project (aws)
Step 1:
```
install eb-cli
eb init
eb create
eb deploy
eb console
```
Step 2:
From the EB App Dashboard, go to Eb Configuration -> Software Configuration.
Under Container Options -> Node Command add "npm start", or "node <yourmainfile>".


