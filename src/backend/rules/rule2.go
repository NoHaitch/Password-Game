package rules

import (
	"fmt"
)

// Rule 2 – Your password must include a number
func rule2(numbers []int) bool {
	fmt.Print("Rule 2: ")
	fmt.Println(len(numbers) > 0)
	return len(numbers) > 0
}
