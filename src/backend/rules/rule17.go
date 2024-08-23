package rules

import (
	"strconv"
)

// Rule 17 – At least X% of your password must be in digits
func rule17(length int, percent float32, numbers []int) (bool, float32) {
	return containPercentDigits(length, percent, numbers)
}

func containPercentDigits(length int, percent float32, numbers []int) (bool, float32) {
	totalDigits := 0
	for _, num := range numbers {
		totalDigits += len(strconv.Itoa(num))
	}

	actualPercent := (float32(totalDigits) / float32(length))

	return actualPercent >= percent, actualPercent
}
