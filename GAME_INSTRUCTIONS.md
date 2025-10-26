# 🎮 How to Run the Game / Jak uruchomić grę

---

## 🇬🇧 English Version

### What You Need Before Starting

Before you can play the game, you need to install one program on your computer:

**Node.js** - This is a free program that helps run the game on your computer.

#### For Windows Users:
1. Go to https://nodejs.org/
2. Click the big green button that says "Download Node.js (LTS)"
3. Once downloaded, double-click the file and follow the installation wizard
4. Keep clicking "Next" and then "Install"
5. Restart your computer after installation

#### For Mac Users:
1. Go to https://nodejs.org/
2. Click the big green button that says "Download Node.js (LTS)"
3. Once downloaded, double-click the .pkg file
4. Follow the installation steps
5. Restart your computer after installation

### Getting Your API Key

The game uses Google's AI service, so you need a special key (it's free!):

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key that appears (it will look like a long string of letters and numbers)
5. Keep this key safe - you'll need it in the next step!

### Setting Up the Game

1. **Open the game folder:**
   - Find the folder where you downloaded/copied the game
   - This folder should contain files like `package.json` and `README.md`

2. **Create the configuration file:**
   - In the game folder, create a new text file
   - Name it exactly: `.env.local` (yes, it starts with a dot!)
   - **Windows tip:** Use Notepad and when saving, choose "All Files" as file type
   - **Mac tip:** Use TextEdit and make sure it's in Plain Text mode (Format → Make Plain Text)

3. **Add your API key:**
   - Open the `.env.local` file
   - Type this line: `GEMINI_API_KEY=`
   - Paste your API key right after the equals sign (no spaces!)
   - Example: `GEMINI_API_KEY=AIzaSyAbc123def456ghi789`
   - Save and close the file

### Installing the Game

Now we need to prepare the game files:

#### For Windows:
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Type: `cd ` (with a space after cd)
4. Drag the game folder into the command window and press Enter
5. Type: `npm install` and press Enter
6. Wait for it to finish (you'll see lots of text scrolling - this is normal!)

#### For Mac:
1. Open "Terminal" (use Spotlight search, type "Terminal")
2. Type: `cd ` (with a space after cd)
3. Drag the game folder into the Terminal window and press Enter
4. Type: `npm install` and press Enter
5. Wait for it to finish (you'll see lots of text scrolling - this is normal!)

### Running the Game

Every time you want to play:

#### For Windows:
1. Open Command Prompt (Windows Key + R, type `cmd`, press Enter)
2. Navigate to the game folder again: `cd ` then drag the folder
3. Type: `npm run dev` and press Enter
4. Wait a few seconds
5. Open your web browser and go to: `http://localhost:5173`
6. The game should now be running!

#### For Mac:
1. Open Terminal
2. Navigate to the game folder: `cd ` then drag the folder
3. Type: `npm run dev` and press Enter
4. Wait a few seconds
5. Open your web browser and go to: `http://localhost:5173`
6. The game should now be running!

### Stopping the Game

When you're done playing:
- Go back to the Command Prompt (Windows) or Terminal (Mac)
- Press `Ctrl + C` on your keyboard
- The game will stop running

---

## 🇵🇱 Wersja Polska

### Co potrzebujesz przed rozpoczęciem

Zanim będziesz mógł zagrać w grę, musisz zainstalować jeden program na swoim komputerze:

**Node.js** - To darmowy program, który pomaga uruchomić grę na Twoim komputerze.

#### Dla użytkowników Windows:
1. Wejdź na stronę https://nodejs.org/
2. Kliknij duży zielony przycisk "Download Node.js (LTS)"
3. Po pobraniu kliknij dwukrotnie na plik i postępuj zgodnie z instrukcjami instalatora
4. Klikaj "Dalej" a potem "Instaluj"
5. Po instalacji uruchom ponownie komputer

#### Dla użytkowników Mac:
1. Wejdź na stronę https://nodejs.org/
2. Kliknij duży zielony przycisk "Download Node.js (LTS)"
3. Po pobraniu kliknij dwukrotnie na plik .pkg
4. Postępuj zgodnie z instrukcjami instalacji
5. Po instalacji uruchom ponownie komputer

### Uzyskanie klucza API

Gra korzysta z usługi AI Google, więc potrzebujesz specjalnego klucza (jest darmowy!):

1. Wejdź na https://aistudio.google.com/apikey
2. Zaloguj się swoim kontem Google
3. Kliknij "Create API Key" (Utwórz klucz API)
4. Skopiuj klucz, który się pojawi (będzie wyglądał jak długi ciąg liter i cyfr)
5. Zachowaj ten klucz w bezpiecznym miejscu - będzie potrzebny w następnym kroku!

### Konfiguracja gry

1. **Otwórz folder z grą:**
   - Znajdź folder, do którego pobrałeś/skopiowałeś grę
   - Ten folder powinien zawierać pliki takie jak `package.json` i `README.md`

2. **Utwórz plik konfiguracyjny:**
   - W folderze z grą utwórz nowy plik tekstowy
   - Nazwij go dokładnie: `.env.local` (tak, zaczyna się od kropki!)
   - **Wskazówka dla Windows:** Użyj Notatnika i podczas zapisywania wybierz "Wszystkie pliki" jako typ pliku
   - **Wskazówka dla Mac:** Użyj TextEdit i upewnij się, że jest w trybie Zwykły tekst (Format → Zmień na zwykły tekst)

3. **Dodaj swój klucz API:**
   - Otwórz plik `.env.local`
   - Wpisz tę linię: `GEMINI_API_KEY=`
   - Wklej swój klucz API zaraz po znaku równości (bez spacji!)
   - Przykład: `GEMINI_API_KEY=AIzaSyAbc123def456ghi789`
   - Zapisz i zamknij plik

### Instalacja gry

Teraz musimy przygotować pliki gry:

#### Dla Windows:
1. Naciśnij `Klawisz Windows + R`
2. Wpisz `cmd` i naciśnij Enter
3. Wpisz: `cd ` (ze spacją po cd)
4. Przeciągnij folder z grą do okna wiersza polecenia i naciśnij Enter
5. Wpisz: `npm install` i naciśnij Enter
6. Poczekaj na zakończenie (zobaczysz dużo przewijającego się tekstu - to normalne!)

#### Dla Mac:
1. Otwórz "Terminal" (użyj wyszukiwarki Spotlight, wpisz "Terminal")
2. Wpisz: `cd ` (ze spacją po cd)
3. Przeciągnij folder z grą do okna Terminala i naciśnij Enter
4. Wpisz: `npm install` i naciśnij Enter
5. Poczekaj na zakończenie (zobaczysz dużo przewijającego się tekstu - to normalne!)

### Uruchamianie gry

Za każdym razem, gdy chcesz zagrać:

#### Dla Windows:
1. Otwórz Wiersz polecenia (Klawisz Windows + R, wpisz `cmd`, naciśnij Enter)
2. Przejdź ponownie do folderu z grą: `cd ` a potem przeciągnij folder
3. Wpisz: `npm run dev` i naciśnij Enter
4. Poczekaj kilka sekund
5. Otwórz przeglądarkę internetową i wejdź na: `http://localhost:5173`
6. Gra powinna teraz działać!

#### Dla Mac:
1. Otwórz Terminal
2. Przejdź do folderu z grą: `cd ` a potem przeciągnij folder
3. Wpisz: `npm run dev` i naciśnij Enter
4. Poczekaj kilka sekund
5. Otwórz przeglądarkę internetową i wejdź na: `http://localhost:5173`
6. Gra powinna teraz działać!

### Zatrzymywanie gry

Kiedy skończysz grać:
- Wróć do Wiersza polecenia (Windows) lub Terminala (Mac)
- Naciśnij `Ctrl + C` na klawiaturze
- Gra przestanie działać

---

## 💡 Troubleshooting / Rozwiązywanie problemów

### English:
- **"Command not found" or "npm is not recognized"**: Node.js wasn't installed correctly. Try reinstalling it and restarting your computer.
- **"Invalid API key"**: Check that you copied the entire key correctly into `.env.local` with no extra spaces.
- **"Port already in use"**: Another program is using port 5173. Try closing other programs or restart your computer.
- **Game won't load**: Make sure you're using a modern web browser (Chrome, Firefox, Safari, or Edge).

### Polski:
- **"Command not found" lub "npm nie jest rozpoznawane"**: Node.js nie został poprawnie zainstalowany. Spróbuj zainstalować go ponownie i uruchomić komputer ponownie.
- **"Invalid API key"**: Sprawdź, czy poprawnie skopiowałeś cały klucz do `.env.local` bez dodatkowych spacji.
- **"Port already in use"**: Inny program używa portu 5173. Spróbuj zamknąć inne programy lub uruchomić komputer ponownie.
- **Gra się nie ładuje**: Upewnij się, że używasz nowoczesnej przeglądarki (Chrome, Firefox, Safari lub Edge).

---

## 🎉 Enjoy the game! / Baw się dobrze!
