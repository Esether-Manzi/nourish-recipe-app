/**
 * Countries with recipes: everything TheMealDB has (checked by country name) plus our built-in
 * local collections. `query` is the name TheMealDB files recipes under; `localArea` pulls in
 * built-in recipes.
 */

export type Country = { code: string; name: string; region: Region; query: string; localArea?: string };

export type Region = 'Africa' | 'Americas' | 'Asia & Middle East' | 'Europe' | 'Oceania';

export const REGIONS: Region[] = ['Africa', 'Americas', 'Asia & Middle East', 'Europe', 'Oceania'];

const UNSORTED: Country[] = [
  { code: 'UG', name: 'Uganda', region: 'Africa', query: '', localArea: 'Ugandan' },
  { code: 'NG', name: 'Nigeria', region: 'Africa', query: '', localArea: 'Nigerian' },
  { code: 'GH', name: 'Ghana', region: 'Africa', query: '', localArea: 'Ghanaian' },
  { code: 'CM', name: 'Cameroon', region: 'Africa', query: '', localArea: 'Cameroonian' },
  { code: 'ZA', name: 'South Africa', region: 'Africa', query: '', localArea: 'South African' },
  { code: 'KR', name: 'South Korea', region: 'Asia & Middle East', query: '', localArea: 'Korean' },
  { code: 'AF', name: 'Afghanistan', region: 'Asia & Middle East', query: 'Afghanistan' },
  { code: 'AL', name: 'Albania', region: 'Europe', query: 'Albania' },
  { code: 'DZ', name: 'Algeria', region: 'Africa', query: 'Algeria' },
  { code: 'AD', name: 'Andorra', region: 'Europe', query: 'Andorra' },
  { code: 'AO', name: 'Angola', region: 'Africa', query: 'Angola' },
  { code: 'AR', name: 'Argentina', region: 'Americas', query: 'Argentina' },
  { code: 'AM', name: 'Armenia', region: 'Asia & Middle East', query: 'Armenia' },
  { code: 'AW', name: 'Aruba', region: 'Americas', query: 'Aruba' },
  { code: 'AU', name: 'Australia', region: 'Oceania', query: 'Australia' },
  { code: 'AT', name: 'Austria', region: 'Europe', query: 'Austria', localArea: 'Austrian' },
  { code: 'AZ', name: 'Azerbaijan', region: 'Asia & Middle East', query: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas', region: 'Americas', query: 'Bahamas' },
  { code: 'BD', name: 'Bangladesh', region: 'Asia & Middle East', query: 'Bangladesh' },
  { code: 'BB', name: 'Barbados', region: 'Americas', query: 'Barbados' },
  { code: 'BE', name: 'Belgium', region: 'Europe', query: 'Belgium' },
  { code: 'BW', name: 'Botswana', region: 'Africa', query: 'Botswana' },
  { code: 'BR', name: 'Brazil', region: 'Americas', query: 'Brazil' },
  { code: 'BG', name: 'Bulgaria', region: 'Europe', query: 'Bulgaria' },
  { code: 'KH', name: 'Cambodia', region: 'Asia & Middle East', query: 'Cambodia' },
  { code: 'CA', name: 'Canada', region: 'Americas', query: 'Canada' },
  { code: 'KY', name: 'Cayman Islands', region: 'Americas', query: 'Cayman Islands' },
  { code: 'CL', name: 'Chile', region: 'Americas', query: 'Chile' },
  { code: 'CN', name: 'China', region: 'Asia & Middle East', query: 'China', localArea: 'Chinese' },
  { code: 'CO', name: 'Colombia', region: 'Americas', query: 'Colombia' },
  { code: 'CR', name: 'Costa Rica', region: 'Americas', query: 'Costa Rica' },
  { code: 'HR', name: 'Croatia', region: 'Europe', query: 'Croatia' },
  { code: 'CU', name: 'Cuba', region: 'Americas', query: 'Cuba' },
  { code: 'DK', name: 'Denmark', region: 'Europe', query: 'Denmark', localArea: 'Danish' },
  { code: 'DM', name: 'Dominica', region: 'Americas', query: 'Dominica' },
  { code: 'EG', name: 'Egypt', region: 'Africa', query: 'Egypt' },
  { code: 'EE', name: 'Estonia', region: 'Europe', query: 'Estonia' },
  { code: 'FR', name: 'France', region: 'Europe', query: 'France', localArea: 'French' },
  { code: 'GR', name: 'Greece', region: 'Europe', query: 'Greece' },
  { code: 'IN', name: 'India', region: 'Asia & Middle East', query: 'India', localArea: 'Indian' },
  { code: 'IE', name: 'Ireland', region: 'Europe', query: 'Ireland' },
  { code: 'IT', name: 'Italy', region: 'Europe', query: 'Italy', localArea: 'Italian' },
  { code: 'JM', name: 'Jamaica', region: 'Americas', query: 'Jamaica' },
  { code: 'JP', name: 'Japan', region: 'Asia & Middle East', query: 'Japan', localArea: 'Japanese' },
  { code: 'KE', name: 'Kenya', region: 'Africa', query: 'Kenya' },
  { code: 'LA', name: 'Laos', region: 'Asia & Middle East', query: 'Laos' },
  { code: 'MY', name: 'Malaysia', region: 'Asia & Middle East', query: 'Malaysia' },
  { code: 'MX', name: 'Mexico', region: 'Americas', query: 'Mexico' },
  { code: 'MA', name: 'Morocco', region: 'Africa', query: 'Morocco' },
  { code: 'NL', name: 'Netherlands', region: 'Europe', query: 'Netherlands' },
  { code: 'NO', name: 'Norway', region: 'Europe', query: 'Norway' },
  {
    code: 'PH',
    name: 'Philippines',
    region: 'Asia & Middle East',
    query: 'Philippines',
    localArea: 'Filipino',
  },
  { code: 'PL', name: 'Poland', region: 'Europe', query: 'Poland' },
  { code: 'PT', name: 'Portugal', region: 'Europe', query: 'Portugal' },
  { code: 'RU', name: 'Russia', region: 'Europe', query: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Asia & Middle East', query: 'Saudi Arabia' },
  { code: 'SK', name: 'Slovakia', region: 'Europe', query: 'Slovakia' },
  { code: 'ES', name: 'Spain', region: 'Europe', query: 'Spain' },
  { code: 'SY', name: 'Syria', region: 'Asia & Middle East', query: 'Syria' },
  { code: 'TH', name: 'Thailand', region: 'Asia & Middle East', query: 'Thailand' },
  { code: 'TN', name: 'Tunisia', region: 'Africa', query: 'Tunisia' },
  { code: 'TR', name: 'Türkiye', region: 'Asia & Middle East', query: 'Turkish' },
  { code: 'UA', name: 'Ukraine', region: 'Europe', query: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', query: 'United Kingdom', localArea: 'British' },
  { code: 'US', name: 'United States', region: 'Americas', query: 'United States', localArea: 'American' },
  { code: 'UY', name: 'Uruguay', region: 'Americas', query: 'Uruguay' },
  { code: 'VE', name: 'Venezuela', region: 'Americas', query: 'Venezuela' },
  { code: 'VN', name: 'Vietnam', region: 'Asia & Middle East', query: 'Vietnam' },
];

/** Uganda first (the app's home collection), then alphabetical. */
export const COUNTRIES: Country[] = [
  UNSORTED[0],
  ...UNSORTED.slice(1).sort((a, b) => a.name.localeCompare(b.name)),
];

/** Turns a two-letter country code into its flag emoji. */
export const flagOf = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export const countryByCode = (code: string) => COUNTRIES.find((c) => c.code === code.toUpperCase());
