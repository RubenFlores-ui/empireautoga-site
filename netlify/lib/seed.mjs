// Starting inventory, used only until the first save from the admin page.
const IMG = "https://imagescf.dealercenter.net/640/480/";
const car = (o) => ({ status: "available", vin: "", carfaxUrl: "", carfaxValue: "", extColor: "", intColor: "", engine: "", drivetrain: "", transmission: "", fuel: "", doors: "", description: "", video: "", featured: true, ...o });

export const SEED = [
  car({ id: "ody18", year: 2018, make: "HONDA", model: "ODYSSEY", trim: "", body: "Minivan", price: null, miles: null, stock: "ODY18",
        photos: ["/media/odyssey-1.jpg", "/media/odyssey-8.jpg", "/media/odyssey-16.jpg", "/media/odyssey-25.jpg"], video: "/media/odyssey-walkaround.mp4" }),
  car({ id: "a0049", vin: "19UDE2F38HA004918", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/g2Xpc8GSxzOwAu0jM39ww9lX7ilQYMtuwnmF7ps9dLF9SInGHiUodwFKhq7t-ky7A_KvX5MqdQP1nmYO1tdIgUBOZJJDusHf_Lg", carfaxValue: "good",  year: 2017, make: "ACURA",  model: "ILX",                trim: "Sedan 4D",                   body: "Sedan",  price: 11849, miles: 142835, stock: "A0049",  photos: [IMG + "202610-d4e9aa8516ec47a7a5aafb2debf3219b.jpg"] }),
  car({ id: "504773", vin: "2HKRM3H76FH504773", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/a-PKMh2U92TEsr0LxyfVCESQ6LPdBGmA4unBLQz_4pou3mAa6fGXz4eCRwC63xmxkXvRJgp9LmLBuVxgmAfRPWHZiRHMJiZVtGw", carfaxValue: "great", year: 2015, make: "HONDA",  model: "CR-V",               trim: "EX-L Sport Utility 4D",      body: "SUV",    price: 10394, miles: 152625, stock: "504773", photos: [IMG + "202611-2e8813d32e63454f94f9274e2f29f924.jpg"] }),
  car({ id: "460466", vin: "5YFBURHE1GP460446", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/Qvf4QPQ9zFCrZ94jjFk7ZD2569KSBFVK3EFoNJ7p4v-nA_skJrwJCtca5DcSRXSW8r8WZ54k7ANQt3WOWl6LSAYnXDgm-UH2h34", carfaxValue: "good", year: 2016, make: "TOYOTA", model: "COROLLA",            trim: "S Plus Sedan 4D",            body: "Sedan",  price: 9849,  miles: 146149, stock: "460466", photos: [IMG + "202610-b1ca344b022d42c180583dbc9c68befd.jpg"] }),
  car({ id: "303052", vin: "1ZVBP8AM4E5303052", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/OE2eWjNnCbGHRgKsXvL9QbA6Q74HXVtvu2no3ml-WCeo6pKisyom9f0b_fD4KQq2LCDMzGX5xGHJMX5dlhOwFokH-Qzy_IJk10g", carfaxValue: "1own_great", year: 2014, make: "FORD",   model: "MUSTANG",            trim: "V6 Premium Coupe 2D",        body: "Coupe",  price: 9394,  miles: 141895, stock: "303052", photos: [IMG + "202609-c5093c2d02ed47318f3c60c6f7632e1b.jpg"] }),
  car({ id: "094704", vin: "5FNYF6H02KB094704", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/nKicgFvm4aXOKMBWM_smOBuZGkAxWVj6gYaSnli6ktBJRX6jCS0u6qquCBe9UfhgDa2Oajx1NEC1kf0tWXGYD_bHz1JsEci2obM", carfaxValue: "good", year: 2019, make: "HONDA",  model: "PILOT",              trim: "Elite Sport Utility 4D",     body: "SUV",    price: 15849, miles: 152425, stock: "094704", photos: [IMG + "202610-50286760a2e746708a6982fe95497368.jpg"] }),
  car({ id: "527493", vin: "JM3KFACM0K0527493", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/cuFIBvRiEXzoZYzWKMDN77WOJtpRsUGCElahUTqugEsJBiG1UN0eVUtQRhORKKb1uYcF5y9n6dmBhBUB161UExys4cbJdgCgzmw", carfaxValue: "fair", year: 2019, make: "MAZDA",  model: "CX-5",               trim: "Touring Sport Utility 4D",   body: "SUV",    price: 12849, miles: 143285, stock: "527493", photos: [IMG + "202609-68ced31d0dde48af876929d462242be0.jpg"] }),
  car({ id: "20062", vin: "1FTFW1ET3DFD20062", carfaxUrl: "https://www.carfax.com/vehiclehistory/ar20/ZlaOB_IqvQv7U3t1v0ivkxCw0k0C8pBlAaqpnd3JBfzVVubSBYzlTCMCZuGo_VEKEG9GrIpvw0-YvbXtC2YZ9oZhoeXkRajkba4", carfaxValue: "great",  year: 2013, make: "FORD",   model: "F150 SUPERCREW CAB", trim: "Limited Pickup 4D 5 1/2 ft", body: "Pickup", price: 12394, miles: 154256, stock: "20062",  photos: [IMG + "202611-c5baff35885d44e4ac21d109882f5cc2.jpg"] }),
];

import { getStore } from "@netlify/blobs";
// Load saved inventory (or the starting list), filling in any VIN / Carfax details from the
// starting list that haven't been entered yet for the same stock number.
export async function loadCars() {
  const saved = await getStore({ name: "inventory", consistency: "strong" }).get("cars", { type: "json" });
  if (!saved) return SEED;
  const byStock = new Map(SEED.map((c) => [String(c.stock).toLowerCase(), c]));
  return saved.map((c) => {
    const s = byStock.get(String(c.stock || "").toLowerCase());
    if (!s) return c;
    return { ...c, vin: c.vin || s.vin, carfaxUrl: c.carfaxUrl || s.carfaxUrl, carfaxValue: c.carfaxValue || s.carfaxValue };
  });
}
