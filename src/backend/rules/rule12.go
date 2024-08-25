package rules

import (
	"backend/algorithms"
)

// Rule 12 – Your password must include this CAPTCHA
// (Anda harus mencari minimal 7 gambar CAPTCHA. Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
func rule12(password string, captcha string) bool {
	searchFound, _ := algorithms.BMSearch(password, captcha)
	return searchFound
}

func cheatRule12(password string, captcha string) string {
	found, _ := algorithms.BMSearch(password, captcha)
	if !found {
		password += captcha
	}
	return password
}
