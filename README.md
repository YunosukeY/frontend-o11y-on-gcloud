# frontend-o11y-with-gcloud

## 準備

### Google Cloud

1. 以下の権限を持つカスタムロールを作成
   - logging.logEntries.create
   - monitoring.timeSeries.create
   - cloudtrace.traces.patch
2. 作成したカスタムロールを使ってサービスアカウントを作成
3. サービスアカウントキーを作成

### アプリケーション

1. .env.sampleを元に.envを作成し、サービスアカウントキーの情報を転記
2. npm install

## 動作確認

1. npm run dev
2. ブラウザでlocalhost:3000を開く
3. テレメトリがGoogle Cloudに送信されるので、Cloud Monitoringなどで確認