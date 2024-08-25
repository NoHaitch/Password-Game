package rules

import (
	"backend/algorithms"
	"unicode"
)

// Rule 17 – At least X% of your password must be in digits
func rule17(length int, percent float32, numbers []string) (bool, float32) {
	return containPercentDigits(length, percent, numbers)
}

func containPercentDigits(length int, percent float32, numbers []string) (bool, float32) {
	totalDigits := 0
	for _, num := range numbers {
		totalDigits += len(num)
	}

	actualPercent := (float32(totalDigits) / float32(length))

	return actualPercent >= percent, actualPercent
}

func cheatRule17(password string, percent float32) string {
	totalDigits := 0
	for _, numStr := range algorithms.RegexGetNumber(password) {
		totalDigits += len(numStr)
	}

	passwordLength := len(password)

	if float32(totalDigits)/float32(passwordLength) <= percent {
		if len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
			passwordLength++
		}

		for (float32(totalDigits) / float32(passwordLength)) <= percent {
			password += "0"
			totalDigits++
			passwordLength++
		}
	}
	return password
}
