"""檢查 data.json 格式：python3 tools/check_data.py data.json"""
import json, sys
d = json.load(open(sys.argv[1], encoding="utf-8"))
assert isinstance(d.get("meta"), dict), "meta 必須是物件"
for k in ("lastRunId", "lastRunTs"):
    assert k in d["meta"], f"meta 缺少 {k}"
items = d.get("projects", {}).get("items")
assert isinstance(items, list) and items, "projects.items 必須是非空陣列"
for p in items:
    for k in ("key", "n", "r", "name"):
        assert k in p, f"工程缺少 {k}: {p}"
news = d.get("news")
assert isinstance(news, list), "news 必須是陣列"
for n in news:
    for k in ("id", "title", "url", "source", "publishedTs", "projects", "summary", "reposts", "firstSeenRun"):
        assert k in n, f"新聞缺少 {k}: {n.get('title')}"
    assert str(n["url"]).startswith("http"), f"網址錯誤: {n['url']}"
print(f"OK：工程 {len(items)} 項，新聞 {len(news)} 則")
pl = d.get("platforms")
if pl is not None:
    assert isinstance(pl, list) and pl, "platforms 必須是非空陣列"
    for x in pl:
        assert x.get("name") and str(x.get("url","")).startswith("http"), f"平台格式錯誤: {x}"
    print(f"OK：新聞平台 {len(pl)} 個")
