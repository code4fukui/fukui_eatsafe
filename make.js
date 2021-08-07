import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import HTMLParser from "https://dev.jspm.io/node-html-parser";

const fn = "certified.html";
const html = await Deno.readTextFile(fn);
const root = HTMLParser.parse(html);

const data = root.querySelectorAll("#shop dl dt").map(dt => [dt.text]);
root.querySelectorAll("#shop dl ul").forEach((ul, i) => {
  const li = ul.querySelectorAll("li");
  data[i].push(li[0].text);
  data[i].push(li[1].text);
});
console.log(data, data.length);

// console.log(root.querySelector("div[[itemprop='dateModified']"));
const dateModified = root.querySelectorAll("div").filter(div => div.attributes.itemprop == "dateModified")[0].attributes.datetime;
console.log(dateModified);
data.forEach((d, i) => d.push(i == 0 ? "更新日" : dateModified));

await Deno.writeTextFile("certified.csv", CSV.encode(data));

