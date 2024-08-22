package rules

import (
	"backend/algorithms"
)

// Rule 12 – Your password must include this CAPTCHA
// (Anda harus mencari minimal 7 gambar CAPTCHA. Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
func rule12(password string, captcha string) bool {
	return algorithms.BMSearch(password, captcha)
}
