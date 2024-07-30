package rules

import "fmt"

// Rule 1 - Your password must be at least X characters
func rule1(password string, x int) bool {
	fmt.Print("Rule 1: ")
	fmt.Println(len(password) >= x)
	return len(password) >= x
}
