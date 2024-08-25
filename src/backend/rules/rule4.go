package rules

import (
	"unicode"
)

// Rule 4 – Your password must contains a special character
func rule4(password string) bool {
	return containsSpecialCharacter(password)
}

// Check if string contains a special character
func containsSpecialCharacter(s string) bool {
	for _, r := range s {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) {
			return true
		}
	}
	return false
}

func cheatRule4(password string) string {
	if !containsSpecialCharacter(password) {
		password += "/"
	}

	return password
}
