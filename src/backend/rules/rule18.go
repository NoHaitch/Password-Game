package rules

import (
	"fmt"
)

// Rule 18 – Your password must include the length of your password
func rule18(password string, numbers []int) bool {
	fmt.Print("Rule 18: ")
	fmt.Println(containPasswordLength(password, numbers))
	return containPasswordLength(password, numbers)
}

// Check if the password contains its own length
func containPasswordLength(password string, numbers []int) bool {
	passwordLength := len(password)

	for _, number := range numbers {
		if number == passwordLength {
			return true
		}
	}

	return false
}
