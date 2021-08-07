const url = "https://fukui-anshin-ninsyou.com/certified.html";
const html = await (await fetch(url)).text();
console.log(html);
Deno.writeTextFile("certified.html", html)
