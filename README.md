# Discord Color Bot

這個專案是一個 Discord 機器人，能夠每小時自動更改身份組的顏色。以下是專案的主要檔案和功能說明：

## 檔案結構

```
discord-color-bot
├── src
│   ├── index.js          # 應用程式的入口點，初始化 Discord 客戶端
│   ├── commands
│   │   └── color.js      # 定義更改身份組顏色的指令
│   ├── events
│   │   └── ready.js      # 機器人啟動後執行的事件
│   └── utils
│       └── colorManager.js # 顏色管理的工具函數
├── config.json           # 機器人的配置檔
├── package.json          # npm 的配置檔
└── README.md             # 專案文檔
```

## 安裝與使用

1. **克隆專案**：
   ```bash
   git clone <repository-url>
   cd discord-color-bot
   ```

2. **安裝依賴**：
   ```bash
   npm install
   ```

3. **配置機器人**：
   在 `config.json` 中填入你的 Discord 機器人 Token 和伺服器 ID。

4. **啟動機器人**：
   ```bash
   node src/index.js
   ```

## 功能

- 每小時自動更改身份組顏色
- 用戶可以透過指令手動更改身份組顏色

## 貢獻

歡迎任何形式的貢獻！請提出問題或提交拉取請求。