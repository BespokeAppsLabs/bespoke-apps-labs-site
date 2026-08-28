/* Service area. These are the provinces and cities the studio works across — a coverage
   claim, not a claim of offices in each. No street address is asserted anywhere, because
   none was given. */

export type Province = { name: string; abbr: string; capital: string; cities: string[] };

/** Primary service area, in priority order. */
export const PRIMARY_PROVINCES: Province[] = [
  {
    name: "Limpopo", abbr: "LP", capital: "Polokwane",
    cities: [
      "Polokwane", "Tzaneen", "Mokopane", "Thohoyandou", "Musina", "Lephalale",
      "Bela-Bela", "Modimolle", "Phalaborwa", "Makhado", "Giyani", "Burgersfort",
      "Louis Trichardt", "Hoedspruit", "Groblersdal",
    ],
  },
  {
    name: "Gauteng", abbr: "GP", capital: "Johannesburg",
    cities: [
      "Johannesburg", "Pretoria", "Sandton", "Midrand", "Centurion", "Soweto",
      "Randburg", "Roodepoort", "Kempton Park", "Benoni", "Boksburg", "Germiston",
      "Alberton", "Krugersdorp", "Vereeniging", "Vanderbijlpark", "Springs", "Brakpan",
    ],
  },
  {
    name: "North West", abbr: "NW", capital: "Mahikeng",
    cities: [
      "Rustenburg", "Klerksdorp", "Potchefstroom", "Mahikeng", "Brits", "Lichtenburg",
      "Vryburg", "Hartbeespoort", "Zeerust", "Orkney", "Stilfontein", "Wolmaransstad",
    ],
  },
  {
    name: "Mpumalanga", abbr: "MP", capital: "Mbombela",
    cities: [
      "Mbombela", "eMalahleni", "Middelburg", "Secunda", "Ermelo", "Standerton",
      "Barberton", "White River", "Sabie", "Bethal", "Lydenburg", "Komatipoort",
      "eMkhondo", "Hazyview", "Malelane",
    ],
  },
];

/** The remaining provinces — served nationally. */
export const OTHER_PROVINCES: Province[] = [
  { name: "KwaZulu-Natal", abbr: "KZN", capital: "Pietermaritzburg",
    cities: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Ballito", "Umhlanga", "Ladysmith", "Empangeni"] },
  { name: "Western Cape", abbr: "WC", capital: "Cape Town",
    cities: ["Cape Town", "Stellenbosch", "Paarl", "George", "Somerset West", "Worcester", "Knysna", "Mossel Bay"] },
  { name: "Eastern Cape", abbr: "EC", capital: "Bhisho",
    cities: ["Gqeberha", "East London", "Mthatha", "Bhisho", "King William's Town", "Queenstown", "Jeffreys Bay"] },
  { name: "Free State", abbr: "FS", capital: "Bloemfontein",
    cities: ["Bloemfontein", "Welkom", "Sasolburg", "Bethlehem", "Kroonstad", "Parys"] },
  { name: "Northern Cape", abbr: "NC", capital: "Kimberley",
    cities: ["Kimberley", "Upington", "Springbok", "Kuruman", "De Aar"] },
];

export const ALL_PROVINCES = [...PRIMARY_PROVINCES, ...OTHER_PROVINCES];

/** The cities that matter most nationally, for keywords and structured data. */
export const MAJOR_SA_CITIES = [
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha", "Bloemfontein",
  "East London", "Pietermaritzburg", "Polokwane", "Mbombela", "Kimberley", "Rustenburg",
  "Klerksdorp", "Vereeniging", "eMalahleni", "George", "Mahikeng", "Welkom",
  "Newcastle", "Richards Bay", "Upington", "Mthatha", "Potchefstroom", "Tzaneen",
];
