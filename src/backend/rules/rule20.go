package rules

import (
	"backend/algorithms"
	"fmt"
	"time"
)

// Rule 20 – Your password must include the current time (hour:minute)
func rule20(password string) bool {
	currentTime := getCurrentTime()
	fmt.Print("Rule 20: ")
	fmt.Println(algorithms.BMSearch(password, currentTime))
	return algorithms.BMSearch(password, currentTime)
}

// Get the current time formatted as "hour:minute"
func getCurrentTime() string {
	now := time.Now()
	return now.Format("15:04")
}
