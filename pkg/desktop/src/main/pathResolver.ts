// 此檔案不要更改資料夾位置

import path from 'path';


export const getUiPath = () =>
  path.join(__dirname, '../ui/electron-ui/index.html');

export const getReuseWebUiPath = () =>
  path.join(__dirname, '../ui/electron-use-web-ui/index.html');

export const getPreloadPath = () =>
  path.join(__dirname, './preload.js');
