package rules

import (
	"backend/algorithms"
)

// "backend/algorithms"

// Check the password
// return the result, accepted, rule5Progres, rule9Progres
func TestPassword(password string, rule1Var int, rule5Var int, rule8Var []string, rule9Var int, captcha string, rule13Var int) ([]bool, bool, int, int) {
	romanNumerals := algorithms.RegexGetRomanNumerals(password)
	numbers := algorithms.RegexGetNumber(password)
	rule5Res, rule5Progres := rule5(password, rule5Var)
	rule9Res, rule9Progres := rule9(romanNumerals, rule9Var)

	// Create a slice to hold the results
	results := []bool{
		rule1(password, rule1Var),           // Rule 1 - Your password must be at least X characters
		rule2(numbers),                      // Rule 2 – Your password must include a number
		rule3(password),                     // Rule 3 – Your password must contain an uppercase character
		rule4(password),                     // Rule 4 – Your password must contains a special character
		rule5Res,                            // Rule 5 – The digits in your password must add up to X
		rule6(password),                     // Rule 6 – Your password must include a month of the year
		rule7(romanNumerals),                // Rule 7 – Your password must include a Roman numeral
		rule8(password, rule8Var),           // Rule 8 – Your password must include one of this country
		rule9Res,                            // Rule 9 – The Roman numerals in your password should multiply to X
		rule10(password),                    // Rule 10 – Oh no! Your password is on fire 🔥. Quick, put it out!
		rule11(password),                    // Rule 11 – 🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe
		rule12(password, captcha),           // Rule 12 – Your password must include this CAPTCHA
		rule13(numbers, rule13Var),          // Rule 13 – Your password must include a leap year
		rule14(password, 0, 0),              // Rule 14 – 🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second
		rule15(password, []string{"abcde"}), // Rule 15 – A sacrifice must be made. Pick X letters that you will no longer be able to use
		rule16(password),                    // Rule 16 – Your password must contain one of the following words: I want IRK | I need IRK | I love IRK
		rule17(password, 0.1, numbers),      // Rule 17 – At least X% of your password must be in digits
		rule18(password, numbers),           // Rule 18 – Your password must include the length of your password
		rule19(password),                    // Rule 19 – The length of your password must be a prime number
		rule20(password),                    // Rule 20 – Your password must include the current time (hour:minute)
	}

	// Check if all rules are met
	allRulesMet := true
	for _, result := range results {
		if !result {
			allRulesMet = false
			break
		}
	}

	return results, allRulesMet, rule5Progres, rule9Progres
}
