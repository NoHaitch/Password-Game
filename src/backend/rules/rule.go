package rules

import (
	"backend/algorithms"
	"fmt"
)

// "backend/algorithms"

// Check if the
func TestPassword(password string) ([]bool, bool) {
	romanNumerals := algorithms.RegexGetRomanNumerals(password)
	numbers := algorithms.RegexGetNumber(password)
	fmt.Println(numbers)

	// Create a slice to hold the results
	results := []bool{
		rule1(password, 5),                    // Rule 1 - Your password must be at least X characters
		rule2(numbers),                        // Rule 2 – Your password must include a number
		rule3(password),                       // Rule 3 – Your password must contain an uppercase character
		rule4(password),                       // Rule 4 – Your password must contains a special character
		rule5(password, 30),                   // Rule 5 – The digits in your password must add up to X
		rule6(password),                       // Rule 6 – Your password must include a month of the year
		rule7(romanNumerals),                  // Rule 7 – Your password must include a Roman numeral
		rule8(password, []string{"ID", "JP"}), // Rule 8 – Your password must include one of this country
		rule9(romanNumerals, 200),             // Rule 9 – The Roman numerals in your password should multiply to X
		rule10(password),                      // Rule 10 – Oh no! Your password is on fire 🔥. Quick, put it out!
		rule11(password),                      // Rule 11 – 🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe
		rule12(password, "captcha"),           // Rule 12 – Your password must include this CAPTCHA
		rule13(numbers),                       // Rule 13 – Your password must include a leap year
	}

	// Check if all rules are met
	allRulesMet := true
	for _, result := range results {
		if !result {
			allRulesMet = false
			break
		}
	}

	return results, allRulesMet
}
