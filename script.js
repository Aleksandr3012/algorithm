function calculateMean(data) {
	const sum = data.reduce((acc, value) => acc + value, 0);
	return sum / data.length;
}

// Тестові масиви
const array1 = [10, 20, 30, 40, 50];
const array2 = [5, 15, 25, 35, 45];
const array3 = [2, 4, 6, 8, 10];

// Обчислення середніх значень
const mean1 = calculateMean(array1);
const mean2 = calculateMean(array2);
const mean3 = calculateMean(array3);

console.log(mean1, mean2, mean3); // Вивід середніх значень для кожного масиву

// Віднімання середнього значення
function subtractMean(data, mean) {
	return data.map(value => value - mean);
}

// Обчислення суми модулів різниць та суми квадратів різниць
function sumOfDifferences(data) {
	const sumOfAbsDiffs = data.reduce((acc, value) => acc + Math.abs(value), 0);
	const sumOfSquares = data.reduce((acc, value) => acc + value * value, 0);
	return {sumOfAbsDiffs, sumOfSquares};
}

// Обчислення віднімання середнього та сум
const adjustedArray1 = subtractMean(array1, mean1);
const adjustedArray2 = subtractMean(array2, mean2);
const adjustedArray3 = subtractMean(array3, mean3);

const {sumOfAbsDiffs: sumAbs1, sumOfSquares: sumSquares1} = sumOfDifferences(adjustedArray1);
const {sumOfAbsDiffs: sumAbs2, sumOfSquares: sumSquares2} = sumOfDifferences(adjustedArray2);
const {sumOfAbsDiffs: sumAbs3, sumOfSquares: sumSquares3} = sumOfDifferences(adjustedArray3);

console.log(`Сума модулів різниць і сума квадратів для масиву 1: ${sumAbs1}, ${sumSquares1}`);
console.log(`Сума модулів різниць і сума квадратів для масиву 2: ${sumAbs2}, ${sumSquares2}`);
console.log(`Сума модулів різниць і сума квадратів для масиву 3: ${sumAbs3}, ${sumSquares3}`);

// Розрахунок стандартних невизначеностей типу А
function standardUncertaintyTypeA(data) {
	const mean = calculateMean(data);
	const sumOfSquares = data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
	return Math.sqrt(sumOfSquares / (data.length - 1));
}

// Розрахунок стандартних невизначеностей типу В
function standardUncertaintyTypeB(min, max) {
	const width = max - min;
	return (width / Math.sqrt(12));
}

// Інтеграція функцій та тестування
// Тестові масиви із кроку 1
const array11 = [10, 20, 30, 40, 50];
const array22 = [5, 15, 25, 35, 45];
const array33 = [2, 4, 6, 8, 10];

// Використання функцій
const uA1 = standardUncertaintyTypeA(array11);
const uA2 = standardUncertaintyTypeA(array22);
const uA3 = standardUncertaintyTypeA(array33);

const uB1 = standardUncertaintyTypeB(1, 3);
const uB2 = standardUncertaintyTypeB(1, 3);
const uB3 = standardUncertaintyTypeB(1, 3);

console.log(`Стандартні невизначеності типу А для масивів: ${uA1}, ${uA2}, ${uA3}`);
console.log(`Стандартні невизначеності типу В для масивів (припустимо однаковий діапазон): ${uB1}, ${uB2}, ${uB3}`);

// Перевірка на наявність кореляції між масивами даних
function pearsonCorrelation(arrayX, arrayY) {
	const meanX = calculateMean(arrayX);
	const meanY = calculateMean(arrayY);

	let num = 0;
	let den1 = 0;
	let den2 = 0;

	for (let i = 0; i < arrayX.length; i++) {
		const dx = arrayX[i] - meanX;
		const dy = arrayY[i] - meanY;

		num += dx * dy;
		den1 += dx * dx;
		den2 += dy * dy;
	}

	const den = Math.sqrt(den1 * den2);
	return num / den;
}

// Оцінка сумарної стандартної невизначеності

function combinedUncertainty(correlations, uncertainties) {
	let sumSquared = uncertainties.reduce((acc, u) => acc + u * u, 0);  // Сума квадратів невизначеностей
	for (let i = 0; i < correlations.length; i++) {
		for (let j = i + 1; j < correlations.length; j++) {
			sumSquared += 2 * correlations[i][j] * uncertainties[i] * uncertainties[j];
		}
	}
	return Math.sqrt(sumSquared);
}

// Приклад використання
const correlations = [
	[1, 0.8, 0.5],
	[0.8, 1, 0.3],
	[0.5, 0.3, 1]
];
const uncertainties = [uA1, uA2, uA3];  // Значення невизначеностей типу А

const totalUncertainty1 = combinedUncertainty(correlations, uncertainties);
console.log(`Сумарна стандартна невизначеність: ${totalUncertainty1}`);

// Крок 9: Розрахунок розширеної невизначеності
function expandedUncertainty(standardUncertainty, coverageFactor1) {
	return standardUncertainty * coverageFactor1;
}

// Припустимо, що коефіцієнт охоплення для 95% довіри є 2
const coverageFactor1 = 2;

// Крок 10: Оцінювання сумарної невизначеності для некорельованих даних
const noCorrelations = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
];

const totalUncertaintyUncorrelated = combinedUncertainty(noCorrelations, uncertainties);
const expandedUncUncorrelated = expandedUncertainty(totalUncertaintyUncorrelated, coverageFactor1);
const totalUncertainty = {source: 'Сумарна невизначеність', value: totalUncertainty1};

const expandedUnc = expandedUncertainty(totalUncertainty, coverageFactor1);
console.log(`Розширена невизначеність для корельованих даних: ${expandedUnc}`);

console.log(`Сумарна стандартна невизначеність для некорельованих даних: ${totalUncertaintyUncorrelated}`);
console.log(`Розширена невизначеність для некорельованих даних: ${expandedUncUncorrelated}`);

// Крок 11: Запис результатів вимірювання та складання бюджету невизначеності
console.log(`Загальні результати вимірювань:
  Сумарна невизначеність (корельовані): ${totalUncertainty}
  Розширена невизначеність (корельовані): ${expandedUnc}
  Сумарна невизначеність (некорельовані): ${totalUncertaintyUncorrelated}
  Розширена невизначеність (некорельовані): ${expandedUncUncorrelated}
`);

// Складання бюджету невизначеності
const uncertaintyBudget = [
	{ source: 'Невизначеність типу А', value: totalUncertainty, expanded: expandedUnc },
	{ source: 'Невизначеність типу В', value: totalUncertaintyUncorrelated, expanded: expandedUncUncorrelated }
];

console.log("Бюджет невизначеності:");
uncertaintyBudget.forEach(item => {
	console.log(`${item.source}: Стандартна невизначеність = ${item.value}, Розширена невизначеність = ${item.expanded}`);
});

function generateUncertaintyBudget(uncertainties, expandedUncertainties) {
	console.log("Бюджет невизначеності:");
	console.log("Джерело невизначеності, Стандартна невизначеність, Розширена невизначеність");
	uncertainties.forEach((u, index) => {
		console.log(`${u.source}: ${u.value.toFixed(3)}, ${expandedUncertainties[index].value.toFixed(3)}`);
	});
}

// Визначення коефіцієнту охоплення для різних рівнів довіри
const coverageFactor = 2; // Коефіцієнт для 95% довіри
const expandedUncertainty1 = {source: 'Розширена невизначеність', value: expandedUncertainty(totalUncertainty.value, coverageFactor)};

generateUncertaintyBudget([totalUncertainty], [expandedUncertainty1]);
