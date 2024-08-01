package rules

import (
	"fmt"
)

// Rule 7 – Your password must include a Roman numeral
func rule7(romanNumerals []string) bool {
	fmt.Print("Rule 7: ")
	fmt.Println(len(romanNumerals) > 0)
	return len(romanNumerals) > 0
}
