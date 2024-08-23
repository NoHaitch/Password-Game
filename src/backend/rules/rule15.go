package rules

import (
	"strings"
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
