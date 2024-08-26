package rules

import (
	"backend/algorithms"
	"strconv"
	"strings"
	"unicode"
)

// Rule 5 – The digits in your password must add up to X
func rule5(password string, x int) (bool, int) {
	sum := sumOfDigits(password)
	return sum == x, sum
}

// Sum of digits in a string
func sumOfDigits(s string) int {
	sum := 0
	for _, r := range s {
		if unicode.IsDigit(r) {
			sum += int(r - '0')
		}
	}
	return sum
}

// Cheat function for Rule 5
func cheatRule5(password string, x int, captcha string, currentTimeStr string, leapyear string, passwordLengthStr string, fillerAmount int, minYear int) (string, bool) {
	currentSumDigit := sumOfDigits(password)
	if currentSumDigit == x {
		return password, true
	} else if currentSumDigit < x {
		sumNeeded := x - currentSumDigit
		if fillerAmount == 0 && len(password) > 0 && unicode.IsDigit(rune(password[len(password)-1])) {
			password += " "
		}

		stringAdded := ""
		for sumNeeded > 0 {
			if sumNeeded >= 9 {
				stringAdded += "9"
				sumNeeded -= 9
			} else {
				stringAdded += strconv.Itoa(sumNeeded)
				sumNeeded = 0
			}
		}

		if len(stringAdded) < fillerAmount {
			password = password[:len(password)-len(stringAdded)] + stringAdded
		} else {
			password = password[:len(password)-fillerAmount] + stringAdded
		}

	} else {
		// Track the positions of restricted strings
		restrictedStrings := []string{captcha, currentTimeStr, leapyear}
		if passwordLengthStr != "" {
			restrictedStrings = append(restrictedStrings, passwordLengthStr)
		}
		restrictedPositionsStart := make([]int, len(restrictedStrings))
		restrictedPositions := make(map[int]bool, len(password))

		for i, rs := range restrictedStrings {
			found, pos := algorithms.BMSearch(password, rs)
			if found {
				restrictedPositionsStart[i] = pos
				for j := pos; j < pos+len(rs); j++ {
					restrictedPositions[j] = true
				}
			} else {
				restrictedPositionsStart[i] = -1
			}
		}

		currentSum := 0
		// add the numbers from important variables
		for i, importantStr := range restrictedStrings {
			if restrictedPositionsStart[i] != -1 {
				currentSum += sumOfDigits(importantStr)
			}
		}

		if currentSum > x {
			leapyearInt, _ := strconv.Atoi(leapyear)
			minYearInt := findSmallestLeapYearAboveMin(minYear)
			if currentSum-leapyearInt+minYearInt > 0 {
				return password, false
			} else {
				password = strings.Replace(password, leapyear, strconv.Itoa(minYearInt), 1)
				leapyear = strconv.Itoa(minYearInt)
			}
		}

		// Track the positions of restricted strings
		restrictedStrings = []string{captcha, currentTimeStr, leapyear}
		if passwordLengthStr != "" {
			restrictedStrings = append(restrictedStrings, passwordLengthStr)
		}
		restrictedPositionsStart = make([]int, len(restrictedStrings))
		restrictedPositions = make(map[int]bool, len(password))

		for i, rs := range restrictedStrings {
			found, pos := algorithms.BMSearch(password, rs)
			if found {
				restrictedPositionsStart[i] = pos
				for j := pos; j < pos+len(rs); j++ {
					restrictedPositions[j] = true
				}
			} else {
				restrictedPositionsStart[i] = -1
			}
		}

		currentSum = 0
		// add the numbers from important variables
		for i, importantStr := range restrictedStrings {
			if restrictedPositionsStart[i] != -1 {
				currentSum += sumOfDigits(importantStr)
			}
		}

		for i := 0; i < len(password)-1; i++ {
			if restrictedPositions[i] {
				continue
			}
			if unicode.IsDigit(rune(password[i])) {
				digit, _ := strconv.Atoi(string(password[i]))
				if currentSum+digit > x {
					if x-currentSum < 0 {
						password = password[:i] + "0" + password[i+1:]
						currentSum -= digit

					} else {
						password = password[:i] + strconv.Itoa(x-currentSum) + password[i+1:]
						currentSum = x

					}
				} else if currentSum == x && digit != 0 {
					password = password[:i] + strconv.Itoa(x-currentSum) + password[i+1:]
				} else {
					currentSum += digit
				}
			}
		}
	}

	return password, true
}
