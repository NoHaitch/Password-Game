package rules

import (
	"backend/algorithms"
	"strconv"
	"unicode"
)

// Rule 19 – The length of your password must be a prime number
func rule19(length int) bool {
	return isPrimeNumber(length)
}

// Check if a number is prime
func isPrimeNumber(x int) bool {
	if x <= 1 {
		return false
	}
	if x <= 3 {
		return true
	}
	if x%2 == 0 || x%3 == 0 {
		return false
	}
	for i := 5; i*i <= x; i += 6 {
		if x%i == 0 || x%(i+2) == 0 {
			return false
		}
	}
	return true
}

func getSmallestPrimeGreaterThanMin(min int) int {
	if isPrimeNumber(min) {
		return min

	}
	for min += 1; ; min++ {
		if isPrimeNumber(min) {
			return min
		}
	}
}

func cheatRule19(password string, gap int) (string, int) {
	passwordLength := getSmallestPrimeGreaterThanMin(len(password) + gap)

	found, _ := algorithms.BMSearch(password, strconv.Itoa(passwordLength))
	if !found {
		if len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
		}

		password += strconv.Itoa(passwordLength)
	}
	return password, passwordLength
}
