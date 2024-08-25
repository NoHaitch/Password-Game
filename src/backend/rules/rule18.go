package rules

import (
	"strconv"
	"unicode"
)

// Rule 18 – Your password must include the length of your password
func rule18(rule18Var int, numbers []string) bool {
	return containPasswordLength(rule18Var, numbers)
}

// Check if the password contains its own length
func containPasswordLength(length int, numbers []string) bool {
	for _, number := range numbers {
		numberInt, _ := strconv.Atoi(number)
		if numberInt == length {
			return true
		}
	}

	return false
}

func cheatRule18(password string, passwordLength int) (string, int) {
	fillerAmount := passwordLength - len(password)
	if len(password) != passwordLength {

		if len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
			fillerAmount--
		}

		tempAmount := fillerAmount

		for i := 0; i < tempAmount; i++ {
			password += "0"
		}
	}

	if fillerAmount < 0 {
		fillerAmount = 0
	}
	return password, fillerAmount
}
