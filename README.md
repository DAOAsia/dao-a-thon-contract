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

### テスト
```shell
yarn hardhat test
```

### デプロイ
```shell
yarn hardhat run scripts/deploy.ts --network mumbai
```
デプロイしたコントラクトアドレスが表示されるので、メモしてください。

### Polygonscanによるコントラクトの認証
```shell
yarn hardhat verify --network mumbai {コントラクトアドレス}
```
