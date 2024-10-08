package rules

import (
	"backend/algorithms"
	"strings"
	"unicode"
)

// Rule 8 – Your password must include one of this country
// (Anda harus mencari minimal 10 gambar bendera negara. Tampilkan X bendera saja pada 1 sesi permainan)
func rule8(password string, countrycodes []string) bool {
	return containsCountry(password, countrycodes)
}

// Check if string contains a special character
func containsCountry(s string, countrycodes []string) bool {
	lower := strings.ToLower(s)
	found := false
	for _, code := range countrycodes {
		searchFound, _ := algorithms.BMSearch(lower, convertCountryCodeToName(code))
		if searchFound {
			found = true
			break
		}
	}

	return found
}

// Function to convert country code to country name
func convertCountryCodeToName(countryCode string) string {
	if country, exists := countryCodes[countryCode]; exists {
		return country
	}
	return ""
}

var countryCodes = map[string]string{
	"AF": "afghanistan",
	"AL": "albania",
	"DZ": "algeria",
	"AD": "andorra",
	"AO": "angola",
	"AR": "argentina",
	"AM": "armenia",
	"AU": "australia",
	"AT": "austria",
	"AZ": "azerbaijan",
	"BH": "bahrain",
	"BD": "bangladesh",
	"BB": "barbados",
	"BY": "belarus",
	"BE": "belgium",
	"BJ": "benin",
	"BT": "bhutan",
	"BO": "bolivia",
	"BA": "bosnia",
	"BW": "botswana",
	"BR": "brazil",
	"BN": "brunei",
	"BG": "bulgaria",
	"BF": "burkina",
	"BI": "burundi",
	"KH": "cambodia",
	"CM": "cameroon",
	"CA": "canada",
	"CV": "capeverde",
	"CF": "centralafricanrepublic",
	"TD": "chad",
	"CL": "chile",
	"CN": "china",
	"CO": "colombia",
	"KM": "comoros",
	"CG": "congo",
	"HR": "croatia",
	"CU": "cuba",
	"CY": "cyprus",
	"CZ": "czechia",
	"DK": "denmark",
	"DJ": "djibouti",
	"DM": "dominica",
	"DO": "dominicanrepublic",
	"TL": "easttimor",
	"EC": "ecuador",
	"EG": "egypt",
	"SV": "elsalvador",
	"GQ": "equatorialguinea",
	"ER": "eritrea",
	"EE": "estonia",
	"SZ": "eswatini",
	"ET": "ethiopia",
	"FJ": "fiji",
	"FI": "finland",
	"FR": "france",
	"GA": "gabon",
	"GM": "gambia",
	"GE": "georgia",
	"DE": "germany",
	"GH": "ghana",
	"GR": "greece",
	"GD": "grenada",
	"GT": "guatemala",
	"GN": "guinea",
	"GW": "guinea-bissau",
	"GY": "guyana",
	"HT": "haiti",
	"HN": "honduras",
	"HU": "hungary",
	"IS": "iceland",
	"IN": "india",
	"ID": "indonesia",
	"IR": "iran",
	"IQ": "iraq",
	"IE": "ireland",
	"IL": "israel",
	"IT": "italy",
	"JM": "jamaica",
	"JP": "japan",
	"JO": "jordan",
	"KZ": "kazakhstan",
	"KE": "kenya",
	"KI": "kiribati",
	"KP": "northkorea",
	"KR": "southkorea",
	"KW": "kuwait",
	"KG": "kyrgyzstan",
	"LA": "laos",
	"LV": "latvia",
	"LB": "lebanon",
	"LS": "lesotho",
	"LR": "liberia",
	"LY": "libya",
	"LI": "liechtenstein",
	"LT": "lithuania",
	"LU": "luxembourg",
	"MG": "madagascar",
	"MW": "malawi",
	"MY": "malaysia",
	"MV": "maldives",
	"ML": "mali",
	"MT": "malta",
	"MH": "marshallislands",
	"MR": "mauritania",
	"MU": "mauritius",
	"MX": "mexico",
	"FM": "micronesia",
	"MD": "moldova",
	"MC": "monaco",
	"MN": "mongolia",
	"ME": "montenegro",
	"MA": "morocco",
	"MZ": "mozambique",
	"NA": "namibia",
	"NR": "nauru",
	"NP": "nepal",
	"NL": "netherlands",
	"NZ": "newzealand",
	"NI": "nicaragua",
	"NE": "niger",
	"NG": "nigeria",
	"MK": "northmacedonia",
	"NO": "norway",
	"OM": "oman",
	"PK": "pakistan",
	"PW": "palau",
	"PA": "panama",
	"PG": "papuanewguinea",
	"PY": "paraguay",
	"PE": "peru",
	"PH": "philippines",
	"PL": "poland",
	"PT": "portugal",
	"QA": "qatar",
	"RO": "romania",
	"RU": "russia",
	"RW": "rwanda",
	"KN": "saintkittsandnevis",
	"LC": "saintlucia",
	"VC": "saintvincentandthegrenadines",
	"WS": "samoa",
	"SM": "sanmarino",
	"ST": "saotomeandprincipe",
	"SA": "saudiarabia",
	"SN": "senegal",
	"RS": "serbia",
	"SC": "seychelles",
	"SL": "sierraleone",
	"SG": "singapore",
	"SK": "slovakia",
	"SI": "slovenia",
	"SB": "solomonislands",
	"SO": "somalia",
	"ZA": "southafrica",
	"SS": "southsudan",
	"ES": "spain",
	"LK": "srilanka",
	"SD": "sudan",
	"SR": "suriname",
	"SE": "sweden",
	"CH": "switzerland",
	"SY": "syria",
	"TW": "taiwan",
	"TJ": "tajikistan",
	"TZ": "tanzania",
	"TH": "thailand",
	"TG": "togo",
	"TO": "tonga",
	"TT": "trinidadandtobago",
	"TN": "tunisia",
	"TR": "turkey",
	"TM": "turkmenistan",
	"TV": "tuvalu",
	"UG": "uganda",
	"UA": "ukraine",
	"AE": "unitedarabemirates",
	"GB": "unitedkingdom",
	"US": "unitedstates",
	"UY": "uruguay",
	"UZ": "uzbekistan",
	"VU": "vanuatu",
	"VE": "venezuela",
	"VN": "vietnam",
	"YE": "yemen",
	"ZM": "zambia",
	"ZW": "zimbabwe",
}

func cheatRule8(password string, countryCodes []string, importantAlphabets *[]string) string {
	if !rule8(password, countryCodes) {
		minNewChars := -1
		selectedCountry := ""

		for _, code := range countryCodes {
			countryName := convertCountryCodeToName(code)
			lowerCountryName := strings.ToLower(countryName)

			if !strings.Contains(strings.ToLower(password), lowerCountryName) {
				newCharsCount := 0
				tempSet := make(map[rune]bool)
				for _, char := range lowerCountryName {
					if unicode.IsLetter(char) && !containsChar(*importantAlphabets, char) {
						tempSet[char] = true
					}
				}
				newCharsCount = len(tempSet)

				if minNewChars == -1 || newCharsCount < minNewChars {
					minNewChars = newCharsCount
					selectedCountry = countryName
				}
			}
		}

		if selectedCountry != "" {
			if len(password) > 0 && unicode.IsLetter(rune(password[len(password)-1])) {
				password += " "
			}
			password += selectedCountry

			for _, char := range strings.ToLower(selectedCountry) {
				if unicode.IsLetter(char) && !containsChar(*importantAlphabets, char) {
					*importantAlphabets = append(*importantAlphabets, string(char))
				}
			}
		}
	}
	return password
}

func containsChar(slice []string, char rune) bool {
	for _, v := range slice {
		if v == string(char) {
			return true
		}
	}
	return false
}
