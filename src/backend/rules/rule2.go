package rules

import (
	"fmt"
	"unicode"
)

// Rule 2 – Your password must include a number
func rule2(password string) bool {
	fmt.Print("Rule 2: ")
	fmt.Println(containsNumber(password))
	return containsNumber(password)
}

// Check if string contains a number
func containsNumber(s string) bool {
	for _, r := range s {
		if unicode.IsDigit(r) {
			return true
		}
	}
	return false
}
