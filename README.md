# dao-a-thon-contract
テスト用のコントラクトは "TestNFT" として別のコントラクトを用意してあります。
関数名などはメインデプロイ用と同じにして実装します。

## 環境構築

### パッケージのインストール
```shell
yarn install
```

### .envファイルの準備
```shell
cp ./.env.example ./.env
```
コピーされた.envファイルの中身を埋めてください。
（使用するネットワークのものだけが正確であれば、あとは適当でもコンパイル＆デプロイできるかと思われます。）

### テスト
```shell
yarn hardhat test
```

### デプロイ
TestNFTのデプロイ
```shell
yarn hardhat run scripts/deployTestNFT.ts --network goerli
```
Daoathonのデプロイ
```shell
yarn hardhat run scripts/deployDaoathon.ts --network goerli
```
デプロイしたコントラクトアドレスが表示されるので、メモしてください。

### Polygonscanによるコントラクトの認証
```shell
yarn hardhat verify --network goerli {コントラクトアドレス}
```
