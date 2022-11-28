const { readFileSync, promises: fsPromises } = require("fs");
const { exit } = require("process");
const readlineSync = require("readline-sync");

// wczytanie nazwy pliku wejsciowego
let file = readlineSync.question();

//deklaracja tablicy, do której przekazany będzie plik wejściowy, podzielony na wierwsze
let splited = [];

// wczytywanie danych z pliku wejściowego
function syncReadFile(filename) {
  try {
    const contents = readFileSync(filename, "utf-8");
    splited = contents.split(/\r?\n/);
  } catch (error) {
    console.error("Błąd z wczytaniem pliku wejściowego \n", error);
    process.exit(1);
  }
}
syncReadFile(file, splited);

// dzielenie pliku wejściowego na tablice
const elephants_number = parseInt(splited[0]);
const elephants_masses = splited[1].split(/ /).map(Number);
const start_order = splited[2].split(/ /).map((x) => parseInt(x) - 1);
const target_order = splited[3].split(/ /).map((x) => parseInt(x) - 1);

// permutacja p
let permutation = [];

// liczba wierzchołków c
let vertexes = 0;

// lista cykli prostych
let C = [];

// odwiedzone
let visited = [...new Array(elephants_number)].map(() => false);

//Konstrukcja permutacji p
function permutationP(n) {
  for (let i = 0; i < n; i++) {
    permutation[target_order[i]] = start_order[i];
  }
}
permutationP(elephants_number);

// rozkład p na cykle proste
for (let i = 0; i < elephants_number; i++) {
  if (!visited[i]) {
    vertexes++;
    let x = i;
    // cykl prosty
    let d = [];
    while (!visited[x]) {
      visited[x] = true;
      d.push(x);
      x = permutation[x];
    }
    C.push(d);
  }
}

//// wyznaczenie parametrów cykli

//masa najlżejszego słonia
let mass_lightest_elephant = Infinity;
//suma C
sumaC = [];
//min C
minC = [];

for (let i = 0; i < vertexes; i++) {
  sumaC[i] = 0;
  minC[i] = Infinity;
  for (let j = 0; j < C[i].length; j++) {
    sumaC[i] = sumaC[i] + elephants_masses[C[i][j]];
    minC[i] = Math.min(minC[i], elephants_masses[C[i][j]]);
  }

  mass_lightest_elephant = Math.min(mass_lightest_elephant, minC[i]);
}

// ---- Obliczanie wyniku

// wynik
let result = 0;

for (let i = 0; i < vertexes; i++) {
  let first_method = sumaC[i] + (C[i].length - 2) * minC[i];
  let second_method =
    sumaC[i] + minC[i] + (C[i].length + 1) * mass_lightest_elephant;
  result = result + Math.min(first_method, second_method);
}

console.log(result);
