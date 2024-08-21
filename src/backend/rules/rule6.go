package rules

import (
	"backend/algorithms"
	"strings"
)

// Rule 6 – Your password must include a month of the year
func rule6(password string) bool {
	months := []string{
		"january", "february", "march", "april", "may", "june",
		"july", "august", "september", "october", "november", "december",
	}
	return containsMonth(password, months)
}

// Check if string contains a month of the year
func containsMonth(s string, months []string) bool {
	lower := strings.ToLower(s)
	for _, month := range months {
		if algorithms.BMSearch(lower, month) {
			return true
		}
	}
	return false
}
