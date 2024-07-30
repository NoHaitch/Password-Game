package rules

import (
	"fmt"
	"unicode"
)

// Rule 4 – Your password must contains a special character
func rule4(password string) bool {
	fmt.Print("Rule 4: ")
	fmt.Println(containsSpecialCharacter(password))
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
