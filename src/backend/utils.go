package main

import "fmt"

func StartYellow() {
	fmt.Print("\x1b[33m")
}

func StartGreen() {
	fmt.Print("\x1b[32m")
}
func StartRed() {
	fmt.Print("\x1b[31m")
}

func ResetColor() {
	fmt.Print("\x1b[0m")
}
