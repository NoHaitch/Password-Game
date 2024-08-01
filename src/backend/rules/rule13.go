package rules

import (
	"fmt"
)

// Rule 13 – Your password must include a leap year
func rule13(numbers []int) bool {
	fmt.Print("Rule 13: ")
	fmt.Println(containsLeapYear(numbers))
	return containsLeapYear(numbers)
}

// Check if slice contains a leap year
func containsLeapYear(numbers []int) bool {
	for _, year := range numbers {
		if isLeapYear(year) {
			return true
		}
	}
	return false
}

// Helper function to determine if a year is a leap year
func isLeapYear(year int) bool {
	if year%4 == 0 {
		if year%100 != 0 || year%400 == 0 {
			return true
		}
	}
	return false
}
