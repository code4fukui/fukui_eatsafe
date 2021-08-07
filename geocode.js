import { CSV } from "https://js.sabae.cc/CSV.js";
import { GeoCodingJP } from "./GeoCodingJP.js";

//const geomap = CSV.toJSON(await CSV.fetch("geocode.csv"));
/*
SJIS.isSJIS = (sjis) => {
	const cerr = String.fromCharCode(65533);
	const s = SJIS.decode(sjis, 10000);
	return s.indexOf(cerr) === -1;
};
*/
const geomap = CSV.toJSON(CSV.decode(await Deno.readTextFile("geocode.csv")));
//console.log(geomap);

const data = CSV.toJSON(await CSV.fetch("certified.csv"));
for (const d of data) {
  const ll = geomap.find(g => g.address == d.住所);
  if (ll) {
    console.log(ll);
  } else {
    const res = await GeoCodingJP.decode(d.住所);
    console.log(res);
    if (res) {
      geomap.push({ address: d.住所, lat: res.lat, lng: res.lng });
    } else {
      geomap.push({ address: d.住所, lat: "-", lng: "-" });
    }
    await Deno.writeTextFile("geocode.csv", CSV.encode(CSV.fromJSON(geomap)));
  }
}
