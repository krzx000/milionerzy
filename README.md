![Logo](./screenshots/logo.png)

# 🎓 Zstlionerzy – Aplikacja Webowa do Przeprowadzania Teleturniejów Szkolnych

Nowoczesna aplikacja quizowa wzorowana na kultowym teleturnieju „Milionerzy", stworzona specjalnie z myślą o przeprowadzaniu konkursów wiedzy na auli szkolnej. System składa się z trzech modułów komunikujących się w czasie rzeczywistym, zapewniając profesjonalne i atrakcyjne przeprowadzenie teleturnieju w warunkach szkolnych.

[![PLIK PDF](https://img.shields.io/badge/Zobacz_Plik_PDF-000?style=for-the-badge)](https://krzx.top/milionerzy)

## 📷 Zrzuty ekranu

![Zrzut 1](./screenshots/screenshot-1.png)
![Zrzut 2](./screenshots/screenshot-2.png)
![Zrzut 3](./screenshots/screenshot-3.png)
![Zrzut 4](./screenshots/screenshot-4.png)
![Zrzut 5](./screenshots/screenshot-5.png)

## ✨ Kluczowe zalety

<!-- - **💻 Działanie offline** – Aplikacja działa w sieci lokalnej bez dostępu do internetu -->

- **⚡ Komunikacja w czasie rzeczywistym** – Wykorzystanie technologii Server-Sent Events (SSE)
- **🎯 Trzy moduły** – Ekran główny, panel administratora i interfejs publiczności
- **🎨 Profesjonalny wygląd** – Atrakcyjny interfejs nadający charakter prawdziwego teleturnieju
- **👥 Interaktywność** – Aktywny udział publiczności w grze

## 🛠 Technologie

- [Next.js 15](https://nextjs.org/) z App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- **Server-Sent Events (SSE)** do komunikacji w czasie rzeczywistym

## 🖥 Moduły systemu

### 👨‍💼 Panel administratora (`/host`)

**Centrum zarządzania teleturniejem** dla prowadzącego:

- Zarządzanie bazą pytań (dodawanie, edycja, import)
- Konfiguracja gry
- Sterowanie przebiegiem gry w czasie rzeczywistym
- Zatwierdzanie odpowiedzi uczestników
- Obsługa wszystkich kół ratunkowych
- Podgląd stanu gry i historii odpowiedzi

### 🎮 Widok gracza/auli/prowadzącego (`/player`)

**Interfejs dla uczestnika teleturnieju**:

- Wyświetlanie aktualnego pytania i odpowiedzi
- Dostęp do kół ratunkowych (50:50, telefon do przyjaciela, pytanie do publiczności)
- Podgląd drabinki nagród z oznaczeniem aktualnej pozycji
- Wskaźniki statusu gry

### 👥 Moduł publiczności

**Aktywny udział widowni w teleturnieju**:

- Podgląd aktualnego pytania podczas głosowania
- Interfejs do głosowania w kole "pytanie do publiczności"
- Wyświetlanie wyników głosowania w czasie rzeczywistym
- Informacje o stanie gry dla publiczności

## 🚀 Nowatorstwo projektu

Projekt wprowadza nowoczesną architekturę klient-serwer z komunikacją w czasie rzeczywistym opartą na technologii **Server-Sent Events (SSE)**. W przeciwieństwie do dostępnych dotychczas rozwiązań, które często opierały się na prymitywnych i mało stabilnych mechanizmach, nowa wersja została zaprojektowana do pracy w sieci lokalnej, całkowicie offline.

**Kluczowe innowacje:**

- **Stabilna komunikacja w czasie rzeczywistym** bez ryzyka przerw internetowych
- **Modułowa architektura** umożliwiająca łatwą rozbudowę
- **Profesjonalne podejście do UI/UX** łączące wysoką niezawodność z łatwością obsługi
- **Interaktywność publiczności** jako integralny element systemu

## 🎯 Zastosowanie praktyczne

Aplikacja znajduje szerokie zastosowanie w środowisku szkolnym:

### 📚 Wydarzenia edukacyjne

- Konkursy wiedzy na różnych przedmiotach
- Dni tematyczne i interdyscyplinarne projekty
- Dni otwarte i prezentacje szkoły
- Urozmaicenie zajęć dydaktycznych

### 🏆 Korzyści dla uczniów

- Rozwój logicznego myślenia i szybkiego podejmowania decyzji
- Zwiększenie zaangażowania w naukę przez element zabawy
- Możliwość aktywnego udziału publiczności
- Budowanie pewności siebie i umiejętności wystąpień publicznych

### 🎪 Atrakcyjność wydarzeń

- Profesjonalny charakter zbliżony do telewizyjnego teleturnieju
- Angażowanie całej widowni, nie tylko uczestników
- Stabilne działanie niezależne od infrastruktury internetowej
- Łatwość obsługi dla nauczycieli i organizatorów

## 🌟 Znaczenie dla placówki edukacyjnej

System wprowadza nowoczesną formę interaktywnych zajęć, która:

- **Zwiększa atrakcyjność** wydarzeń szkolnych i zaangażowanie uczniów
- **Prezentuje nowoczesne technologie** w praktycznym zastosowaniu
- **Inspiruje** nauczycieli i uczniów do tworzenia własnych narzędzi edukacyjnych
- **Wspiera rozwój** innowacyjnych form nauki i zabawy
- **Umożliwia organizację** profesjonalnych teleturniejów bez kosztów zewnętrznych

## 🔮 Możliwości rozwoju

### 🎮 Nowe tryby gry

- **Moduł eliminacji** – szybkie uporządkowanie pytań przez uczestników
- **Rozgrywka wieloosobowa** – kilku uczestników jednocześnie

### 🤖 Funkcje zaawansowane

- **Integracja z AI** - do wyjaśniania poprawnych odpowiedzi
- **System personalizacji** – różne motywy wizualne dla różnych wydarzeń

### 📊 Dodatkowe moduły

- Generator raportów z przeprowadzonych gier
- System zarządzania uczestnikami i klasami
- Biblioteka gotowych zestawów pytań tematycznych
- Moduł treningowy dla uczniów

## 🎈 Dodatkowe zalety

- **💡 Rozwój kompetencji miękkich** – logiczne myślenie, współpraca, prezentacja
- **🎭 Połączenie edukacji z rozrywką** zwiększające motywację do nauki
- **🔧 Modułowość i skalowalność** ułatwiające przyszłe rozszerzenia
- **👨‍👩‍👧‍👦 Włączenie społeczności** poprzez udział publiczności w czasie rzeczywistym

## 🚀 Jak korzystać?

**Nie musisz nic instalować!**

Aplikacja jest już dostępna online pod adresem: [https://zst.krzx.top](https://zst.krzx.top)

### Dostępne widoki:

- [https://zst.krzx.top](https://zst.krzx.top) – **ekran głosowania uczniów**
- [https://zst.krzx.top/player](https://zst.krzx.top/player) – **widok gracza/auli/prowadzącego**
- [https://zst.krzx.top/host](https://zst.krzx.top/host) – **widok administratora**

Wejdź na odpowiedni adres, aby korzystać z aplikacji.

## 📝 Licencja

Projekt stworzony w celach edukacyjnych. Wszelkie prawa do nazwy i koncepcji "Milionerzy" należą do odpowiednich właścicieli.

---

_Projekt realizowany w ramach działalności innowacyjnej w środowisku szkolnym, łączącej nowoczesne technologie z praktyką edukacyjną._
