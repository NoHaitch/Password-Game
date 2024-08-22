package rules

// Rule 18 – Your password must include the length of your password
func rule18(rule18Var int, numbers []int) bool {
	return containPasswordLength(rule18Var, numbers)
}

// Check if the password contains its own length
func containPasswordLength(length int, numbers []int) bool {
	for _, number := range numbers {
		if number == length {
			return true
		}
	}

	return false
}
