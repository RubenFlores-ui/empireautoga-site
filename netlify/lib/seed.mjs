// Starting inventory, used only until the first save from the admin page.
const IMG = "https://imagescf.dealercenter.net/640/480/";
const car = (o) => ({ status: "available", vin: "", extColor: "", intColor: "", engine: "", drivetrain: "", transmission: "", fuel: "", doors: "", description: "", video: "", featured: true, ...o });

export const SEED = [
  car({ id: "ody18", year: 2018, make: "HONDA", model: "ODYSSEY", trim: "", body: "Minivan", price: null, miles: null, stock: "ODY18",
        photos: ["/media/odyssey-1.jpg", "/media/odyssey-8.jpg", "/media/odyssey-16.jpg", "/media/odyssey-25.jpg"], video: "/media/odyssey-walkaround.mp4" }),
  car({ id: "a0049",  year: 2017, make: "ACURA",  model: "ILX",                trim: "Sedan 4D",                   body: "Sedan",  price: 11849, miles: 142835, stock: "A0049",  photos: [IMG + "202610-d4e9aa8516ec47a7a5aafb2debf3219b.jpg"] }),
  car({ id: "504773", year: 2015, make: "HONDA",  model: "CR-V",               trim: "EX-L Sport Utility 4D",      body: "SUV",    price: 10394, miles: 152625, stock: "504773", photos: [IMG + "202611-2e8813d32e63454f94f9274e2f29f924.jpg"] }),
  car({ id: "460466", year: 2016, make: "TOYOTA", model: "COROLLA",            trim: "S Plus Sedan 4D",            body: "Sedan",  price: 9849,  miles: 146149, stock: "460466", photos: [IMG + "202610-b1ca344b022d42c180583dbc9c68befd.jpg"] }),
  car({ id: "303052", year: 2014, make: "FORD",   model: "MUSTANG",            trim: "V6 Premium Coupe 2D",        body: "Coupe",  price: 9394,  miles: 141895, stock: "303052", photos: [IMG + "202609-c5093c2d02ed47318f3c60c6f7632e1b.jpg"] }),
  car({ id: "094704", year: 2019, make: "HONDA",  model: "PILOT",              trim: "Elite Sport Utility 4D",     body: "SUV",    price: 15849, miles: 152425, stock: "094704", photos: [IMG + "202610-50286760a2e746708a6982fe95497368.jpg"] }),
  car({ id: "527493", year: 2019, make: "MAZDA",  model: "CX-5",               trim: "Touring Sport Utility 4D",   body: "SUV",    price: 12849, miles: 143285, stock: "527493", photos: [IMG + "202609-68ced31d0dde48af876929d462242be0.jpg"] }),
  car({ id: "20062",  year: 2013, make: "FORD",   model: "F150 SUPERCREW CAB", trim: "Limited Pickup 4D 5 1/2 ft", body: "Pickup", price: 12394, miles: 154256, stock: "20062",  photos: [IMG + "202611-c5baff35885d44e4ac21d109882f5cc2.jpg"] }),
];
