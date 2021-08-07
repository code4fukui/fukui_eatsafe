import { Geo3x3 } from "https://geo3x3.com/Geo3x3.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const make = async () => {
  const data = CSV.toJSON(await CSV.fetch("certified_townid.csv"));
  const geomap = CSV.toJSON(CSV.decode(await Deno.readTextFile("geocode.csv")));

  for (const d of data) {
    const addr = d.住所;
    const ll = geomap.find(g => g.address == d.住所);
    const geo3x3 = Geo3x3.encode(ll.lat, ll.lng, 14);
    console.log(geo3x3);
    d.geo3x3 = geo3x3 || d.townid;
  }
  data.sort((a, b) => parseInt(a.認証番号) - parseInt(b.認証番号));
  await Deno.writeTextFile("fukui_eatsafe.csv", CSV.encode(CSV.fromJSON(data)));
};

await make();
