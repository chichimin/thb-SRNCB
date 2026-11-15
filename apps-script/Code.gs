/**
 * 新工南工程輿情日報：資料提供端（Google Apps Script 網頁應用程式）
 *
 * 作用：讀取 Google 雲端硬碟「新工南-輿情日報資料」資料夾中最新的 data_*.json，
 *       以 JSON 格式提供給 GitHub Pages 上的日報網頁。
 * 部署：部署 → 新增部署作業 → 類型「網頁應用程式」
 *       執行身分：我　／　誰可以存取：所有人
 */

// 「新工南-輿情日報資料」資料夾 ID
const FOLDER_ID = '1N6B7oA9LeSrM7i8i84mN-7cCeT_nOjWt';
// 資料夾內保留的資料檔數量，超過的舊檔會移到垃圾桶
const KEEP_FILES = 30;

function doGet() {
  const latest = getLatestFile_();
  if (!latest) {
    return json_({ error: '找不到資料檔' });
  }
  const text = latest.getBlob().getDataAsString('UTF-8');
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

/** 取得資料夾中建立時間最新的 data_*.json */
function getLatestFile_() {
  const it = DriveApp.getFolderById(FOLDER_ID).getFiles();
  let latest = null;
  while (it.hasNext()) {
    const f = it.next();
    if (!/^data_.*\.json$/.test(f.getName())) continue;
    if (!latest || f.getDateCreated() > latest.getDateCreated()) latest = f;
  }
  return latest;
}

/** 清理舊資料檔：只保留最新 KEEP_FILES 份（可設定每日觸發條件執行） */
function cleanupOldFiles() {
  const it = DriveApp.getFolderById(FOLDER_ID).getFiles();
  const files = [];
  while (it.hasNext()) {
    const f = it.next();
    if (/^data_.*\.json$/.test(f.getName())) files.push(f);
  }
  files.sort((a, b) => b.getDateCreated() - a.getDateCreated());
  files.slice(KEEP_FILES).forEach(f => f.setTrashed(true));
}

/** 手動測試用：在編輯器執行，看記錄檔是否印出最新檔名 */
function testLatest() {
  const f = getLatestFile_();
  Logger.log(f ? f.getName() : '找不到資料檔');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
