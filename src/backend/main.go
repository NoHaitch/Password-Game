package main

import (
	"fmt"
	"time"
	"unicode"
)

func main() {
	password := "abcdef/awdaga231][131]"
	X := 5

	fmt.Printf("String length: %d\n", len(password))

	// Rule 1 - Your password must be at least X characters
	start := time.Now()
	fmt.Print("Rule 1: ")
	if len(password) >= X {
		fmt.Println(true)
	} else {
		fmt.Println(false)
	}
	elapsed := time.Since(start)
	fmt.Printf("Time taken: %s\n", elapsed)

	// Rule 2 – Your password must include a number
	start = time.Now()
	fmt.Print("Rule 2: ")
	if containsNumber(password) {
		fmt.Println(true)
	} else {
		fmt.Println(false)
	}
	elapsed = time.Since(start)
	fmt.Printf("Time taken: %s\n", elapsed)

	// Rule 3 – Your password must include an uppercase letter
	start = time.Now()
	fmt.Print("Rule 3: ")
	if containsUppercase(password) {
		fmt.Println(true)
	} else {
		fmt.Println(false)
	}
	elapsed = time.Since(start)
	fmt.Printf("Time taken: %s\n", elapsed)

	// Rule 4 – Your password must include a special character
	start = time.Now()
	fmt.Print("Rule 4: ")
	if containsSpecialCharacter(password) {
		fmt.Println(true)
	} else {
		fmt.Println(false)
	}
	elapsed = time.Since(start)
	fmt.Printf("Time taken: %s\n", elapsed)

	// Rule 5 – The digits in your password must add up to X
	// REGEX?

	// Rule 6 – Your password must include a month of the year
	months := []string{
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December",
	}
	fmt.Println(months)
	// KMP/BM/other algorithm

	// Rule 7 – Your password must include a Roman numeral
	start = time.Now()
	fmt.Print("Rule 7: ")
	if containsRomanNumeral(password) {
		fmt.Println(true)
	} else {
		fmt.Println(false)
	}
	elapsed = time.Since(start)
	fmt.Printf("Time taken: %s\n", elapsed)

	// Rule 8 – Your password must include one of this country
	// (Anda harus mencari minimal 10 gambar bendera negara. Tampilkan X bendera saja pada 1 sesi permainan)
	// frontend choose the country and pass the country code

	// Rule 9 – The Roman numerals in your password should multiply to X
	// Rule 10 – Oh no! Your password is on fire 🔥. Quick, put it out!
	// (Emoji api akan “membakar” 1 huruf (menghapus huruf dan menggantikannya dengan emoji api) setiap X detik dimulai dari huruf terakhir. Api tidak akan berhenti membakar sampai semua emoji api pada textfield sudah dihapus. Perlu diperhatikan bahwa api dapat secara random muncul kembali kapanpun dan pemain perlu menghapusnya kembali)
	// Rule 11 – 🥚 This is my chicken Paul. He hasn’t hatched yet. Please put him in your password and keep him safe
	// (Pastikan emoji telur tidak terhapus. Kalau terhapus, pemain dinyatakan kalah)
	// Rule 12 – Your password must include this CAPTCHA
	// (Anda harus mencari minimal 7 gambar CAPTCHA. Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
	// Rule 13 – Your password must include a leap year
	// Rule 14 – 🐔 Paul has hatched ! Please don’t forget to feed him. He eats X 🐛 every Y second
	// (Emoji telur dari rule 11 digantikan dengan emoji ayam. Setiap X detik harus terdapat >= Y emoji ulat. Jika dalam X detik tersebut terdapat < Y ulat, pemain dinyatakan kalah)
	// Rule 15 – A sacrifice must be made. Pick X letters that you will no longer be able to use
	// Rule 16 – Your password must contain one of the following words: I want IRK | I need IRK | I love IRK
	// Rule 17 – At least X% of your password must be in digits
	// Rule 18 – Your password must include the length of your password
	// Rule 19 – The length of your password must be a prime number
	// Rule 20 – Your password must include the current time
}

// Check if string contains a number
func containsNumber(s string) bool {
	for _, r := range s {
		if unicode.IsDigit(r) {
			return true
		}
	}
	return false
}

// Check if string contains an uppercase character
func containsUppercase(s string) bool {
	for _, r := range s {
		if unicode.IsUpper(r) {
			return true
		}
	}
	return false
}

// Check if string contains a special character
func containsSpecialCharacter(s string) bool {
	for _, r := range s {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) {
			return true
		}
	}
	return false
}

// Check if string contains a Roman numeral
func containsRomanNumeral(s string) bool {
	romanNumerals := "IVXLCDM"
	for _, r := range s {
		if unicode.IsLetter(r) && containsRune(romanNumerals, r) {
			return true
		}
	}
	return false
}

// Helper function to check if a rune is in a string
func containsRune(s string, r rune) bool {
	for _, c := range s {
		if c == r {
			return true
		}
	}
	return false
}
