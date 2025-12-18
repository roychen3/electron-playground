// 此檔案不要更改資料夾位置

import path from 'path';

export const getAppUiPath = (restPath = '') =>
  path.join(__dirname, '../ui/', restPath);

export const getReactUiPath = () =>
  path.join(__dirname, '../ui/react-ui/index.html');

export const getPreloadPath = () =>
  path.join(__dirname, './preload.js');
