package rules

// Rule 13 – Your password must include a leap year
func rule13(numbers []int, min int) bool {
	return containsLeapYear(numbers, min)
}

// Check if slice contains a leap year
func containsLeapYear(numbers []int, min int) bool {
	for _, year := range numbers {
		if year > min && isLeapYear(year) {
			return true
		}
	}
	return false
}

// Helper function to determine if a year is a leap year
func isLeapYear(year int) bool {
	if year%4 == 0 {
		if year%100 != 0 || year%400 == 0 {
			return true
		}
	}
	return false
}
