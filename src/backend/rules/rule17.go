package rules

import (
	"fmt"
	"strconv"
)

// Rule 17 – At least X% of your password must be in digits
func rule17(password string, percent float32, numbers []int) bool {
	fmt.Print("Rule 17: ")
	fmt.Println(containPercentDigits(password, percent, numbers))
	return containPercentDigits(password, percent, numbers)
}

func containPercentDigits(s string, percent float32, numbers []int) bool {
	totalLength := len(s)

	totalDigits := 0
	for _, num := range numbers {
		totalDigits += len(strconv.Itoa(num))
	}

	actualPercent := (float32(totalDigits) / float32(totalLength)) * 100

	return actualPercent >= percent
}
