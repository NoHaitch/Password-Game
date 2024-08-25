package rules

import (
	"backend/algorithms"
	"strconv"
	"strings"
	"unicode/utf8"
)

// Fix the password to get a solution
func CheatSolution(password string, rule1Var int, rule5Var int, rule8Var []string, rule9Var int, captcha string, rule13Var int, rule15Var int, rule15Value []string, rule17Var float32, length int) (string, bool, []string) {
	password = strings.ReplaceAll(strings.ToLower(password), "cheat", "")

	state, _, _, _, _ := TestPassword(password, rule1Var, rule5Var, rule8Var, rule9Var, captcha, rule13Var, rule15Var, rule15Value, rule17Var, length)
	importantAlfabets := make([]string, 0)
	solveable := true

	// Rule 10 -- fire
	password = cheatRule10(password)

	// Rule 4 -- Special char
	password = cheatRule4(password)

	// Rule 6 -- month
	password = cheatRule6(password, &importantAlfabets)

	// Rule 8 -- country
	password = cheatRule8(password, rule8Var, &importantAlfabets)

	// Rule 11 and 14 is fufilled at the same time -- egg and chicken
	if state[10] {
		password = cheatRule11(password)
	} else {
		password = cheatRule14(password)
	}

	// Rule 12 -- captcha
	password = cheatRule12(password, captcha)
	addCapchaAlfabets(captcha, &importantAlfabets)

	// Rule 3, 7 and 9 is fufilled at the same time -- roman numerals
	if !state[8] {
		captchaRomanProduct := captchaRomanNumerals(captcha)
		if captchaRomanProduct != 1 {
			newpassword, solveable := cheatRule9WithCaptcha(password, rule9Var, captchaRomanProduct, captcha)
			if !solveable {
				return password, false, rule15Value

			} else {
				password = newpassword
			}
		} else {
			password = cheatRule9(password, algorithms.RegexGetRomanNumerals(password), rule9Var, captcha)
		}
	}
	addRomanNumeralsAlfabets(password, &importantAlfabets)

	// Rule 16 -- I want IRK
	password, solveable = cheatRule16(password, &importantAlfabets)
	if !solveable {
		return password, false, rule15Value
	}

	// Rule 15 -- Banned chars
	password, bannedChars := cheatRule15(password, rule15Var, importantAlfabets)

	// Rule 13 -- Leap Year
	password, leapYearStr := cheatRule13(password, rule13Var)

	// Rule 2 and 20  -- Current Time
	password, currentTimeStr := cheatRule20(password)

	// // Rule 17 -- X% must be digit
	password = cheatRule17(password, rule17Var)

	// Rule 19 -- length must be prime
	password, passwordLength := cheatRule19(password, 15)

	// Rule 18 -- password contain length
	password, fillerAmount := cheatRule18(password, passwordLength)

	// Rule 5 -- Digits add up to X
	password = cheatRule5(password, rule5Var, captcha, currentTimeStr, leapYearStr, strconv.Itoa(passwordLength), fillerAmount)

	// Rule 18 -- password contain length
	password, _ = cheatRule18(password, passwordLength)

	for i, char := range bannedChars {
		bannedChars[i] = strings.ToUpper(char)
	}

	password = addDotsAfterEmoji(password)

	return password, true, bannedChars
}

func captchaRomanNumerals(captcha string) int {
	romanNumerals := algorithms.RegexGetRomanNumerals(captcha)
	return productOfRomanNumerals(romanNumerals)
}

// Add ".." after each emoji
func addDotsAfterEmoji(password string) string {
	var result strings.Builder

	for _, runeValue := range password {
		result.WriteRune(runeValue)
		if utf8.RuneLen(runeValue) > 3 {
			result.WriteString("..")
		}
	}

	return result.String()
}
