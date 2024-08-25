package rules

import (
	"backend/algorithms"
	"strings"
)

// Rule 9 – The Roman numerals in your password should multiply to X
func rule9(romanNumerals []string, x int) (bool, int) {
	sum := productOfRomanNumerals(romanNumerals)
	return sum == x, sum
}

// Calculate the product of the Roman numerals
func productOfRomanNumerals(romanNumerals []string) int {
	product := 1
	for _, numeral := range romanNumerals {
		product *= romanToInt(numeral)
	}
	return product
}

// Convert Roman numeral to integer
func romanToInt(roman string) int {
	romanToIntMap := map[rune]int{
		'I': 1,
		'V': 5,
		'X': 10,
		'L': 50,
		'C': 100,
		'D': 500,
		'M': 1000,
	}

	total := 0
	prevValue := 0
	for _, char := range strings.ToUpper(roman) {
		value := romanToIntMap[char]
		if value > prevValue {
			total += value - 2*prevValue
		} else {
			total += value
		}
		prevValue = value
	}
	return total
}

// Cheat function for Rule 9
func cheatRule9(password string, romanNumerals []string, x int, captcha string) string {
	currentProduct := productOfRomanNumerals(romanNumerals)

	allRomanNumerals := []string{
		"I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM", "M",
	}

	captchaFound, captchaPos := algorithms.BMSearch(password, captcha)

	for _, numeral := range allRomanNumerals {
		if captchaFound {
			beforeCaptcha := password[:captchaPos]
			afterCaptcha := password[captchaPos+len(captcha):]
			beforeCaptcha = strings.ReplaceAll(beforeCaptcha, numeral, strings.ToLower(numeral))
			afterCaptcha = strings.ReplaceAll(afterCaptcha, numeral, strings.ToLower(numeral))
			password = beforeCaptcha + captcha + afterCaptcha
		} else {
			password = strings.ReplaceAll(password, numeral, strings.ToLower(numeral))
		}
	}

	if currentProduct == x {
		return password
	}

	newRomanString := ""

	if x%currentProduct == 0 {
		newRomanString = intToRoman(x / currentProduct)
		if len(password) > 0 && algorithms.IsValidRoman(string(password[len(password)-1])) {
			password += " "
		}
		password += newRomanString
	} else {
		newRomanString = intToRoman(x)
		if len(password) > 0 && algorithms.IsValidRoman(string(password[len(password)-1])) {
			password += " "
		}
		password += newRomanString
	}

	return password
}

func cheatRule9WithCaptcha(password string, x int, captchaRomanProduct int, captcha string) (string, bool) {
	if captchaRomanProduct > x || x%captchaRomanProduct != 0 {
		return "", false
	}

	romanNumerals := algorithms.RegexGetRomanNumerals(password)
	currentProduct := productOfRomanNumerals(romanNumerals)

	if currentProduct == x {
		return password, true
	}

	captchaFound, captchaPos := algorithms.BMSearch(password, captcha)

	tempPassword := strings.Replace(password, captcha, "", 1)
	romanNumeralsWithoutCaptcha := algorithms.RegexGetRomanNumerals(tempPassword)
	romanProductWithoutCaptcha := productOfRomanNumerals(romanNumeralsWithoutCaptcha)

	productNeeded := int(x / captchaRomanProduct)
	newRomanString := ""

	if productNeeded%romanProductWithoutCaptcha == 0 {
		newRomanString = intToRoman(productNeeded / romanProductWithoutCaptcha)
		if len(password) > 0 && algorithms.IsValidRoman(string(password[len(password)-1])) {
			password += " "
		}
		password += newRomanString
	} else {
		allRomanNumerals := []string{
			"I", "IV", "V", "IX", "X", "XL", "L", "XC", "C", "CD", "D", "CM", "M",
		}

		for _, numeral := range allRomanNumerals {
			if captchaFound {
				beforeCaptcha := tempPassword[:captchaPos]
				afterCaptcha := tempPassword[captchaPos:]
				beforeCaptcha = strings.ReplaceAll(beforeCaptcha, numeral, strings.ToLower(numeral))
				afterCaptcha = strings.ReplaceAll(afterCaptcha, numeral, strings.ToLower(numeral))
				tempPassword = beforeCaptcha + afterCaptcha
			} else {
				tempPassword = strings.ReplaceAll(tempPassword, numeral, strings.ToLower(numeral))
			}
		}

		newRomanString = intToRoman(x / captchaRomanProduct)
		if len(tempPassword) > 0 && algorithms.IsValidRoman(string(tempPassword[len(tempPassword)-1])) {
			tempPassword += " "
		}
		tempPassword += newRomanString

		if len(captcha) > 0 && algorithms.IsValidRoman(string(captcha[0])) {
			tempPassword += " "
		}
		tempPassword += captcha
		password = tempPassword
	}

	return password, true
}

// Converts an integer to a Roman numeral string
func intToRoman(num int) string {
	vals := []int{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1}
	syms := []string{"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"}

	var sb strings.Builder

	for i, val := range vals {
		for num >= val {
			num -= val
			sb.WriteString(syms[i])
		}
	}

	return sb.String()
}
