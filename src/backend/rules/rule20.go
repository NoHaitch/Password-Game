package rules

import (
	"backend/algorithms"
	"time"
	"unicode"
)

// Rule 20 – Your password must include the current time (hour:minute)
func rule20(password string) bool {
	currentTime := getCurrentTime()
	found, _ := algorithms.BMSearch(password, currentTime)
	return found
}

// Get the current time formatted as "hour:minute"
func getCurrentTime() string {
	now := time.Now()
	return now.Format("15:04")
}

func cheatRule20(password string) (string, string) {
	currentTime := getCurrentTime()
	found, _ := algorithms.BMSearch(password, currentTime)

	if !found {
		if len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
		}
		password += currentTime
	}
	return password, currentTime
}
