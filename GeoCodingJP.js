import { sleep } from "https://js.sabae.cc/sleep.js";

const url = "https://www.geocoding.jp/api/?q=";

const delayTime = 10 * 1000;
let lastCall = 0;
const delay = async () => {
  const t = new Date().getTime();
  if (t - lastCall < delayTime) {
    await sleep(delayTime - (t - lastCall));
  }
  lastCall = t;
};

class GeoCodingJP {
  static async decode(adr) {
    await delay();
    const txt = await (await fetch(url + encodeURIComponent(adr))).text();
    try {
      const lat = txt.match(/<lat>(\d+\.\d+)<\/lat>/)[1];
      const lng = txt.match(/<lng>(\d+\.\d+)<\/lng>/)[1];
      return { lat, lng };
    } catch (e) {
      return null;
    }
  }
}

//console.log(await GeoCodingJP.decode("福井県大野市陽明町3-401"))

export { GeoCodingJP };
