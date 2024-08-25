package rules

import (
	"backend/algorithms"
	"strings"
	"unicode"
)

// Rule 15 – A sacrifice must be made. Pick X letters that you will no longer be able to use
func rule15(password string, rule15Var int, chars []string) bool {
	if len(chars) < rule15Var {
		return false
	}

	lowerPassword := strings.ToLower(password)
	lowerChars := make([]string, len(chars))
	for i, c := range chars {
		lowerChars[i] = strings.ToLower(c)
	}

	return !containChars(lowerPassword, lowerChars)
}

// Check if string contains a list of characters
func containChars(s string, chars []string) bool {
	charMap := make(map[string]bool)
	for _, c := range chars {
		charMap[c] = true
	}

	for _, r := range s {
		if charMap[string(r)] {
			return true
		}
	}

	return false
}

func addCapchaAlfabets(captcha string, importantAlfabets *[]string) {
	for _, char := range captcha {
		lowerChar := strings.ToLower(string(char))
		if !strings.ContainsAny(lowerChar, "abcdefghijklmnopqrstuvwxyz") {
			continue
		}
		exists := false
		for _, c := range *importantAlfabets {
			if c == lowerChar {
				exists = true
				break
			}
		}
		if !exists {
			*importantAlfabets = append(*importantAlfabets, lowerChar)
		}
	}
}

func addRomanNumeralsAlfabets(password string, importantAlfabets *[]string) {
	romanNumerals := algorithms.RegexGetRomanNumerals(password)
	for _, numeral := range romanNumerals {
		for _, char := range numeral {
			lowerChar := strings.ToLower(string(char))
			if !strings.ContainsAny(lowerChar, "abcdefghijklmnopqrstuvwxyz") {
				continue
			}
			exists := false
			for _, c := range *importantAlfabets {
				if c == lowerChar {
					exists = true
					break
				}
			}
			if !exists {
				*importantAlfabets = append(*importantAlfabets, lowerChar)
			}
		}
	}
}

// Cheat function for Rule 15
func cheatRule15(password string, bannedAmount int, importantAlfabets []string) (string, []string) {
	allAlphabets := "abcdefghijklmnopqrstuvwxyz"
	lowerPassword := strings.ToLower(password)

	passwordChars := make(map[rune]bool)
	for _, r := range lowerPassword {
		if unicode.IsLetter(r) {
			passwordChars[r] = true
		}
	}

	importantAlfabetsMap := make(map[rune]bool)
	for _, r := range importantAlfabets {
		if unicode.IsLetter([]rune(r)[0]) {
			importantAlfabetsMap[[]rune(r)[0]] = true
		}
	}

	availableAlphabets := []rune{}
	for _, char := range allAlphabets {
		if !passwordChars[char] {
			availableAlphabets = append(availableAlphabets, char)
		}
	}

	bannedChars := []string{}
	if len(availableAlphabets) > bannedAmount {
		// iterate from z to a
		for i := len(allAlphabets) - 1; i >= 0; i-- {
			char := rune(allAlphabets[i])
			if !passwordChars[char] && !importantAlfabetsMap[char] {
				bannedChars = append(bannedChars, string(char))
				if len(bannedChars) == bannedAmount {
					break
				}
			}
		}

	} else {
		// iterate from z to a
		for i := len(allAlphabets) - 1; i >= 0; i-- {
			char := rune(allAlphabets[i])
			if !importantAlfabetsMap[char] {
				bannedChars = append(bannedChars, string(char))
				if len(bannedChars) == bannedAmount {
					break
				}
			}
		}

		// remove all banned chars from the password
		for _, char := range bannedChars {
			lowerChar := string(char)
			upperChar := strings.ToUpper(lowerChar)
			password = strings.ReplaceAll(password, lowerChar, "")
			password = strings.ReplaceAll(password, upperChar, "")
		}
	}

	return password, bannedChars
}

// Helper function to check if a slice of strings contains a specific string
func containsString(slice []string, s string) bool {
	for _, item := range slice {
		if item == s {
			return true
		}
	}
	return false
}
