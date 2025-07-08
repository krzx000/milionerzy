# 🎓 Milionerzy – Teleturniej Webowy

Aplikacja webowa inspirowana teleturniejem "Milionerzy", umożliwiająca prowadzenie gry na żywo z widokiem gracza, widokiem prowadzącego (admina) oraz widokiem publiczności. Zbudowana w technologii **Next.js App Router**, z wykorzystaniem **WebSocketów** do natychmiastowej synchronizacji.

## 🛠 Technologie

- [Next.js 14+ (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Socket.IO (WebSocket)](https://socket.io/)
- [Prisma](https://www.prisma.io/)

## 🖥 Widoki

### 👨‍💼 Admin (`/admin`)

- Edycja pytań i odpowiedzi
- Ustalanie liczby rund
- Ustawianie kwot gwarantowanych
- Definiowanie nagród za pytania
- Włączanie/wyłączanie kół ratunkowych
- Start gry
- Sterowanie postępem, zaznaczanie odpowiedzi, zakończenie gry

### 🎮 Gracz (`/player`)

- Widzi aktualne pytanie
- Może wybierać odpowiedzi
- Ma dostęp do kół ratunkowych (jeśli są aktywne)
- Widzi drabinkę nagród

### 👥 Publiczność (`/audience`)

- Podgląd pytania
- Udział w głosowaniu przy pytaniu do publiczności

<!-- ## 📡 WebSocket – Eventy

| Event                 | Kierunek         | Opis                        |
| --------------------- | ---------------- | --------------------------- |
| `game:start`          | Admin → Wszystko | Rozpoczęcie gry             |
| `game:update`         | Server → Clients | Aktualizacja stanu gry      |
| `player:answer`       | Player → Server  | Gracz wybrał odpowiedź      |
| `admin:confirmAnswer` | Admin → Server   | Admin zatwierdził odpowiedź |
| `admin:useLifeline`   | Admin → Server   | Użyto koła ratunkowego      |
| `game:end`            | Server → Clients | Gra zakończona              | -->
