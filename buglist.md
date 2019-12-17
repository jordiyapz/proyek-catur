# Bug List

## List of Known Bugs

- [ ] Pada rotate, hitam kadang bisa skip sendiri
- [ ] Ketika `Agent` lagi mikir, browser nge-*freeze*
- [ ] Kadang `Agent` ngeskip jalannya
- [ ] Pernah sampai nge-*reload* tab sendiri waktu lagi mikir
- [ ] Pada `evalCheck(...)` di *BoardLite.js* ada error king tidak ditemukan

## List of Predicted Bugs

- [x] Kemungkinan Bug pada fitur en-Passant x rotate
- [ ] Kemungkinan Bug pada `getPossibleMoves()` x rotate
- [ ] Kemungkinan Bug pada *King.js* di
        `newKing.castableRooks.push(rook.clone());`

        clone() {
            const {x, y} = this.coord;
            const newKing = new King(x, y, this.isWhite);
            const {castableRooks, castlingable, isOnCheck} = this;
            newKing.castlingable = castlingable;
            for (const rook of castableRooks) {
                newKing.castableRooks.push(rook.clone());
            }
            newKing.isOnCheck = isOnCheck;
            return newKing;
        }

> **Note:** Klon *Rook* yang di push tidak akan sama dengan rook yg seharusnya disimpan oleh king

## Fixed Bugs

- [x] fixed `piece.clone()` bugs
- [x] Tulisan check cuma muncul sekali
- [x] Tulisan check muncul saat checkmate
- [x] Gerakan raja di awal tidak jelas
- [x] Setelah *Pawn Promote* tidak ada tulisan check
- [x] *Castling* ketika ada musuh di dua petak di sebelah raja masih bisa
