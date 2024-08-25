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
		found, _ := algorithms.BMSearch(lower, month)
		if found {
			return true
		}
	}

	return false
}

func cheatRule6(password string, importantAlfabets *[]string) string {
	months := []string{
		"january", "february", "march", "april", "may", "june",
		"july", "august", "september", "october", "november", "december",
	}

	if !rule6(password) {
		password += months[4] // Choose "may" since it is the shortest. Lowercase to avoid conflict with the roman numerals

		for _, char := range "may" {
			lowerChar := string(char)
			if !containsString(*importantAlfabets, lowerChar) {
				*importantAlfabets = append(*importantAlfabets, lowerChar)
			}
		}
	} else {
		lowerPassword := strings.ToLower(password)
		for _, month := range months {
			if strings.Contains(lowerPassword, month) {
				for _, char := range month {
					lowerChar := string(char)
					if !containsString(*importantAlfabets, lowerChar) {
						*importantAlfabets = append(*importantAlfabets, lowerChar)
					}
				}
				break
			}
		}
	}

	return password
}
