package rules

import (
	"backend/algorithms"
	"strconv"
	"unicode"
)

// Rule 13 – Your password must include a leap year
func rule13(numbers []string, min int) bool {
	return containsLeapYear(numbers, min)
}

// Check if slice contains a leap year
func containsLeapYear(numbers []string, min int) bool {
	for _, year := range numbers {
		yearInt, _ := strconv.Atoi(year)
		if yearInt >= min && isLeapYear(yearInt) {
			return true
		}
	}
	return false
}

// Check if slice contains a leap year
func containsLeapYearAndReturn(numbers []string, min int) (bool, string) {
	for _, year := range numbers {
		yearInt, _ := strconv.Atoi(year)
		if yearInt >= min && isLeapYear(yearInt) {
			return true, year
		}
	}
	return false, ""
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

func cheatRule13(password string, min int) (string, string) {
	rule13Res, leapyear := containsLeapYearAndReturn(algorithms.RegexGetNumber(password), min)

	if !rule13Res {
		smallestLeapYear := findSmallestLeapYearAboveMin(min)

		if len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
		}
		password += strconv.Itoa(smallestLeapYear)
		return password, strconv.Itoa(smallestLeapYear)
	}

	return password, leapyear
}

func findSmallestLeapYearAboveMin(min int) int {
	for min <= 99999 {
		if isLeapYear(min) {
			return min
		}
		min++
	}

	return -1
}
