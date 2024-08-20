package rules

import (
	"fmt"
)

// Rule 19 – The length of your password must be a prime number
func rule19(password string) bool {
	fmt.Print("Rule 19: ")
	fmt.Println(isPrimeNumber(len(password)))
	return isPrimeNumber(len(password))
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
