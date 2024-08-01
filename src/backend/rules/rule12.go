package rules

import (
	"backend/algorithms"
	"fmt"
)

// Rule 12 – Your password must include this CAPTCHA
// (Anda harus mencari minimal 7 gambar CAPTCHA. Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
func rule12(password string, captcha string) bool {
	fmt.Print("Rule 12: ")
	fmt.Println(algorithms.BMSearch(password, captcha))
	return algorithms.BMSearch(password, captcha)
}
