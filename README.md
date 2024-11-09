# 概要

OAuth の実装例として Google の OAuth をライブラリを使用せずに実装

# 準備

`/server`配下に.env を作成し以下を設定

```
CLIENT_ID="自身のclient_id"
CLIENT_SCRETE="自身のclient_secret"
CALLBACK_URL="http://localhost:3000/api/googleRedirect"
```
