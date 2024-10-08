package rules

import (
	"unicode"
)

// Rule 3 – Your password must contain an uppercase character
func rule3(password string) bool {
	return containsUppercase(password)
}

// Check if string contains an uppercase character
func containsUppercase(s string) bool {
	for _, r := range s {
		if unicode.IsUpper(r) {
			return true
		}
	}
	return false
}
