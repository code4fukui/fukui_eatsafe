import IMIEnrichmentAddress from "https://code4sabae.github.io/imi-enrichment-address-es/IMIEnrichmentAddress.mjs";
import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";
import { CSV } from "https://js.sabae.cc/CSV.js";
import { TownID } from "https://code4fukui.github.io/TownID/TownID.js";

const startsWithMax = (array, s) => {
  let max = 0;
  let tmax = null;
  for (const t of array) {
    const len = Math.min(s.length, t.length);
    for (let i = 0; i < len; i++) {
      if (s[i] != t[i]) {
        if (i > max) {
          max = i;
          tmax = t;
        }
        break;
      }
    }
  }
  return [tmax, max];
};

const search = async (addr) => {
  const prefs = await TownID.getPrefs();
  const pref = prefs.find(p => addr.startsWith(p));
  if (!pref) {
    return null;
  }
  addr = addr.substring(pref.length).trim();

  const cities = await TownID.getCities(pref);
  let city = cities.find(c => addr.startsWith(c));
  if (!city) {
    /*
    const ngun = addr.indexOf("郡");
    if (ngun >= 1) {
      addr = addr.substring(ngun + 1);
      city = cities.find(c => addr.startsWith(c));
    }
    */
    if (!city) {
      const [tmax, max] = startsWithMax(cities, addr);
      if (!tmax) {
        return null;
      }
      for (const k of "市区町村") {
        const addr2 = addr.substring(0, max) + k + addr.substring(max);
        city = cities.find(t => addr2.startsWith(t));
        if (city) {
          addr = addr2;
          break;
        }
      }
      if (!city) {
        return null;
      }
    }
  }
  addr = addr.substring(city.length).trim();
  
  // 数を見つけて、丁目表記に変更、全角、漢数字表記非対応
  const n = addr.match(/(\d+)/);
  if (n && n.length > 1) {
    const idx = addr.indexOf(n[1]); // 何丁目まである!?
    addr = addr.substring(0, idx) + "〇一二三四五六七八九"[n[1]] + "丁目" + addr.substring(idx + n[1].length);
  }

  const towns = await TownID.getTowns(pref, city);
  let town = towns.find(t => addr.startsWith(t));
  if (!town) {
    //console.log(city, towns.filter(t => t.indexOf("金") >= 0).join(","));
    const [tmax, max] = startsWithMax(towns, addr);
    if (!tmax) {
      return null;
    }
    addr = addr.substring(0, max) + "町" + addr.substring(max);
    town = towns.find(t => addr.startsWith(t));
    if (!town) {
      return null;
    }
  }
  
  return await TownID.find(pref, city, town);
};

const make = async () => {
  const data = CSV.toJSON(await CSV.fetch("certified.csv"));

  for (const d of data) {
    let addr = d.住所;
    if (!addr.startsWith("福井県")) {
      addr = "福井県" + addr;
    }
    const fixes = [
      ["中狭", "中挾"],
      ["福井県勝山市170-70", "福井県勝山市芳野170-70"],
      ["熊登野", "能登野"],
      ["小浜市塩竈", "小浜市小浜塩竃"],
      ["小浜市清滝", "小浜市小浜清滝"],
      ["品ヶ瀬町", "品ケ瀬町"],
      ["金ヶ崎町", "金ケ崎町"],
      ["坂井市三国", "坂井市三国町三国東"],
      ["福井県大飯郡高浜町 若狭和田ビーチ", "福井県大飯郡高浜町和田 若狭和田ビーチ"],
      ["福井市船橋黒竜1丁目", "福井市舟橋黒竜1丁目"],
    ]
    for (const fix of fixes) {
      addr = addr.replace(fix[0], fix[1]);
    }
    const res = await search(addr);
    //console.log(res);
    if (res) {
      d.townid = res;
    } else {
      console.log(addr);
    }
  }
  await Deno.writeTextFile("certified_townid.csv", CSV.encode(CSV.fromJSON(data)));
};

const makeIMI = async () => {
  const data = CSV.toJSON(await CSV.fetch("certified.csv"));

  for (const d of data) {
    const res = await IMIEnrichmentAddress(d.住所);
    console.log(res);
    if (res.地理座標) {
      const lat = res.地理座標.緯度;
      const lng = res.地理座標.経度;
      const geo3x3 = Geo3x3.encode(lat, lng, 12);
      console.log(geo3x3);
      d.geo3x3 = geo3x3;
    } else {
      console.log(d.住所);
    }
  }
  await Deno.writeTextFile("certified_geo3x3.csv", CSV.encode(CSV.fromJSON(data)));
};

await make();


//const addr = "福井県大野市陽明町3-401";
//const addr = "福井県吉田郡永平寺松岡上合月2-66-1";
//const addr = "福井県福井市船橋黒竜1丁目206";
//const addr = "福井市問屋町3-201"; // 県省略
const addr = "福井県越前市大屋48-7-3"; // 福井県坂井市三国東5-1-20 // 三国町省略
//console.log(await search(addr));
// 大野市中挾 大野市中狭
// 福井県大野市中狭3丁目1102 -> 福井県大野市中挾3丁目1102 の間違い
// 福井県吉田郡永平寺松岡上合月2-66-1 永平寺町の町が省略してある
// 福井県福井市品ヶ瀬町5-97 -> 福井県福井市品ケ瀬町5-97 の間違い
// 福井県三方上中郡若狭町熊登野38-13-1 -> 福井県三方上中郡若狭町能登野38-13-1 の間違い

// 町省略
// 福井県福井市石盛2丁目2005
// 福井県福井市下六条14-1 福井県生活学習館内1F -> 下六条町が省略されている
// 福井県大野市明倫町6-29 -> 町省略
// 福井県鯖江市つつじケ丘15-1 -> 町省略
// 福井県越前市横市28-14-1 武生楽市2F -> 町省略
// 福井県勝山市170-70 -> 福井県勝山市芳野170-70 町名省略
// ヶ　ケ 問題
// 福井県坂井市三国町米ヶ脇4-4-28 -> 福井県坂井市三国町米ケ脇4-4-28 の間違い
// 福井県敦賀市金ヶ崎町4-1
// 省略
// 福井県小浜市清滝86-2 -> 福井県小浜市小浜清滝86-2  小浜がない
// 福井県小浜市塩竈60 小浜がない
// 異体字
// "福井県小浜市小浜塩竈60"; // 小浜塩竃
// データにない
// 福井県福井市船橋黒竜1丁目206
// 福井県福井市東森田3-1815
// 福井県坂井市丸岡町東洋2-92 // 1丁目までしかない

//const res = await IMIEnrichmentAddress(addr); // NG
//console.log(res);

//const townid = await TownID.find("福井県", "大野市", "陽明町三丁目");
//console.log(townid);

//console.log(await search("福井県大野市陽明町三丁目"));

