package rules

// Rule 1 - Your password must be at least X characters
func rule1(password string, x int) bool {
	return len(password) >= x
}
