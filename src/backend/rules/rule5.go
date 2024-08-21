package rules

import (
	"unicode"
)

// Rule 5 – The digits in your password must add up to X
func rule5(password string, x int) (bool, int) {
	sum := sumOfDigits(password)
	return sum == x, sum
}

// Sum of digits in a string
func sumOfDigits(s string) int {
	sum := 0
	for _, r := range s {
		if unicode.IsDigit(r) {
			sum += int(r - '0')
		}
	}
	return sum
}
