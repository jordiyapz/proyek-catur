# Bug List

## Fixed Bugs

- [x] fixed `piece.clone()` bugs
- [x] Tulisan check cuma muncul sekali
- [x] Tulisan check muncul saat checkmate

## List of Known Bugs

- [ ] Gerakan raja di awal tidak jelas
- [ ] Setelah *Pawn Promote* tidak ada tulisan check
- [ ] Pada rotate, hitam kadang bisa skip sendiri

## List of Predicted Bugs

- [ ] Kemungkinan Bug pada fitur en-Passant x rotate
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
