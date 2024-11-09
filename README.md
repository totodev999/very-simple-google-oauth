# 概要

OAuth の実装例として Google の OAuth をライブラリを使用せずに実装

# 準備

1. Google OAuth の設定（client_id client_secret の取得）

   [参考リンク](https://tenkake.net/google-oauth-authentication-settings/#:~:text=Google%20OAuth%E8%AA%8D%E8%A8%BC%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86%E3%80%90Google%20Calendar%20%E9%80%A3%E6%90%BA%E8%A8%AD%E5%AE%9A%E7%B7%A8%E3%80%91%201%20Google%20OAuth%E8%AA%8D%E8%A8%BC%E3%82%92%E5%88%A9%E7%94%A8%E3%81%99%E3%82%8B%E3%81%AB%E3%81%AF%EF%BC%9F%20Google,%E3%82%92%E6%9B%B8%E3%81%8D%E6%8F%9B%E3%81%88%E3%80%81%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E4%B8%8A%E3%81%A7%E5%8F%A9%E3%81%8F%E3%81%93%E3%81%A8%E3%81%A7%E3%80%8E%E3%82%B3%E3%83%BC%E3%83%89%E3%80%8F%E3%82%92%E5%8F%96%E5%BE%97%E3%81%97%E3%81%BE%E3%81%99%E3%80%82%20...%204%20%E8%A8%AD%E5%AE%9A%E6%89%8B%E9%A0%86%E2%91%A2%EF%BC%9AGoogle%20Token%20URL%E3%82%88%E3%82%8A%E3%80%8E%E3%83%AA%E3%83%95%E3%83%AC%E3%83%83%E3%82%B7%E3%83%A5%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%80%8F%E3%82%92%E5%8F%96%E5%BE%97%E3%81%97%E3%82%88%E3%81%86%20%E3%80%8CPostman%E3%80%8D%E3%82%92%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%81%97%E3%82%88%E3%81%86%20)

2. 取得した client_id などを環境変数に設定する

   `/server`配下に.env を作成し以下を設定

   ```
   CLIENT_ID="自身のclient_id"
   CLIENT_SCRETE="自身のclient_secret"
   CALLBACK_URL="http://localhost:3000/api/googleRedirect"
   ```

# 実行

```
npm install
```

```
npm run dev
```
