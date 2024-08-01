package rules

import (
	"backend/algorithms"
	"fmt"
)

// Rule 6 – Your password must include a month of the year
func rule6(password string) bool {
	months := []string{
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
		"january", "february", "march", "april", "may", "june",
		"july", "august", "september", "october", "november", "december",
	}

	fmt.Print("Rule 6: ")
	fmt.Println(containsMonth(password, months))
	return containsMonth(password, months)
}

// Check if string contains a month of the year
func containsMonth(s string, months []string) bool {
	for _, month := range months {
		if algorithms.BMSearch(s, month) {
			return true
		}
	}
	return false
}
