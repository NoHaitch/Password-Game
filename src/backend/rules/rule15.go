package rules

import (
	"fmt"
)

// Rule 15 – A sacrifice must be made. Pick X letters that you will no longer be able to use
func rule15(password string, chars []string) bool {
	fmt.Print("Rule 15: ")
	fmt.Println(!containChars(password, chars))
	return !containChars(password, chars)
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
