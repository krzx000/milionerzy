import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleQuestions = [
  {
    content: "Stolica Polski to:",
    answerA: "Kraków",
    answerB: "Warszawa",
    answerC: "Gdańsk",
    answerD: "Wrocław",
    correctAnswer: "B",
  },
  {
    content: "Kto napisał 'Pan Tadeusz'?",
    answerA: "Adam Mickiewicz",
    answerB: "Juliusz Słowacki",
    answerC: "Henryk Sienkiewicz",
    answerD: "Bolesław Prus",
    correctAnswer: "A",
  },
  {
    content:
      "Jaka jest wartość liczby π z dokładnością do trzech miejsc po przecinku?",
    answerA: "3.141",
    answerB: "3.142",
    answerC: "3.143",
    answerD: "3.144",
    correctAnswer: "B",
  },
  {
    content: "Które państwo ma największą powierzchnię na świecie?",
    answerA: "Chiny",
    answerB: "USA",
    answerC: "Rosja",
    answerD: "Kanada",
    correctAnswer: "C",
  },
  {
    content: "W którym roku odbył się pierwszy lot braci Wright?",
    answerA: "1901",
    answerB: "1903",
    answerC: "1905",
    answerD: "1907",
    correctAnswer: "B",
  },
  // Kilka dodatkowych pytań bazowych, by łatwiej dobić do 12 bez duplikatów
  {
    content: "Który pierwiastek ma symbol O?",
    answerA: "Złoto",
    answerB: "Srebro",
    answerC: "Tlen",
    answerD: "Żelazo",
    correctAnswer: "C",
  },
  {
    content: "Ile jest kontynentów na Ziemi?",
    answerA: "5",
    answerB: "6",
    answerC: "7",
    answerD: "8",
    correctAnswer: "C",
  },
  {
    content: "Jak nazywa się największy ocean na Ziemi?",
    answerA: "Ocean Atlantycki",
    answerB: "Ocean Spokojny",
    answerC: "Ocean Indyjski",
    answerD: "Ocean Arktyczny",
    correctAnswer: "B",
  },
  {
    content: "Który instrument ma klawisze i struny?",
    answerA: "Gitara",
    answerB: "Fortepian",
    answerC: "Skrzypce",
    answerD: "Flet",
    correctAnswer: "B",
  },
  {
    content: "Jak nazywa się stolica Francji?",
    answerA: "Paryż",
    answerB: "Rzym",
    answerC: "Madryt",
    answerD: "Berlin",
    correctAnswer: "A",
  },
  {
    content: "Który miesiąc ma 28 dni w roku nieprzestępnym?",
    answerA: "Luty",
    answerB: "Styczeń",
    answerC: "Marzec",
    answerD: "Listopad",
    correctAnswer: "A",
  },
  {
    content: "Ile wynosi 5! (silnia)?",
    answerA: "60",
    answerB: "120",
    answerC: "24",
    answerD: "720",
    correctAnswer: "B",
  },
];

async function main() {
  console.log("Start seedowania bazy danych...");
  // Nie usuwaj pytań – tylko uzupełnij do 12 sztuk
  const TARGET_COUNT = 12;

  const existingQuestions = await prisma.question.findMany({
    select: { content: true },
  });
  const existingContents = new Set(existingQuestions.map((q) => q.content));

  const currentCount = existingQuestions.length;
  if (currentCount >= TARGET_COUNT) {
    console.log(`W bazie jest już ${currentCount} pytań – nie dodaję nowych.`);
    console.log("Seedowanie zakończone!");
    return;
  }

  const needed = TARGET_COUNT - currentCount;
  const toInsert: typeof sampleQuestions = [];

  // 1) Spróbuj wstawić brakujące z przygotowanych próbek bez dublowania contentu
  for (const q of sampleQuestions) {
    if (toInsert.length >= needed) break;
    if (!existingContents.has(q.content)) {
      toInsert.push(q);
      existingContents.add(q.content);
    }
  }

  // 2) Jeśli nadal brakuje, generuj warianty z unikalnym contentem
  let idx = 1;
  while (toInsert.length < needed) {
    const base =
      sampleQuestions[(toInsert.length + idx) % sampleQuestions.length];
    const variantContent = `${base.content} (wariant ${idx})`;
    if (!existingContents.has(variantContent)) {
      toInsert.push({ ...base, content: variantContent });
      existingContents.add(variantContent);
    }
    idx++;
  }

  // Wstaw partią
  const result = await prisma.question.createMany({ data: toInsert });
  console.log(
    `Dodano ${result.count} pytań. Razem w bazie będzie ${
      currentCount + result.count
    }.`
  );
  console.log("Seedowanie zakończone!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
