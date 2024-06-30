function calculateMean(data) {
	const sum = data.reduce((acc, value) => acc + value, 0);
	return sum / data.length;
}

// Тестові масиви
const array1 = [91.5, 92, 91.5, 91, 91];
const array2 = [91.5, 92.5, 92, 92, 92];
const array3 = [92.5, 93, 93, 93.5, 193];

// Обчислення середніх значень
const mean1 = calculateMean(array1);
const mean2 = calculateMean(array2);
const mean3 = calculateMean(array3);

console.log("Вивід середніх значень для кожного масиву:", mean1, mean2, mean3);

// Обчислення стандартних невизначеностей типу А
function standardUncertaintyTypeA(data) {
	const mean = calculateMean(data);
	const sumOfSquares = data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
	return Math.sqrt(sumOfSquares / (data.length - 1));
}

const uA1 = standardUncertaintyTypeA(array1);
const uA2 = standardUncertaintyTypeA(array2);
const uA3 = standardUncertaintyTypeA(array3);

console.log(`Стандартні невизначеності типу А для масивів: ${uA1}, ${uA2}, ${uA3}`);

// Розрахунок стандартних невизначеностей типу В
function standardUncertaintyTypeB(min, max) {
	const width = max - min;
	return (width / Math.sqrt(12));
}

const uB1 = standardUncertaintyTypeB(1, 3);
const uB2 = standardUncertaintyTypeB(1, 3);
const uB3 = standardUncertaintyTypeB(1, 3);

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

const correlation12 = pearsonCorrelation(array1, array2);
const correlation13 = pearsonCorrelation(array1, array3);
const correlation23 = pearsonCorrelation(array2, array3);

console.log(`Коефіцієнти кореляції: 1-2: ${correlation12}, 1-3: ${correlation13}, 2-3: ${correlation23}`);

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

const correlations = [
	[1, correlation12, correlation13],
	[correlation12, 1, correlation23],
	[correlation13, correlation23, 1]
];

const uncertainties = [uA1, uA2, uA3];  // Значення невизначеностей типу А

const totalUncertainty1 = combinedUncertainty(correlations, uncertainties);
console.log(`Сумарна стандартна невизначеність: ${totalUncertainty1}`);

const totalUncertainty = { source: 'Сумарна невизначеність', value: totalUncertainty1 };

// Розрахунок розширеної невизначеності
function expandedUncertainty(standardUncertainty, coverageFactor) {
	return standardUncertainty * coverageFactor;
}

// Припустимо, що коефіцієнт охоплення для 95% довіри є 2
const coverageFactor1 = 2;

const expandedUnc = expandedUncertainty(totalUncertainty1, coverageFactor1);
console.log(`Розширена невизначеність для корельованих даних: ${expandedUnc}`);

// Оцінювання сумарної невизначеності для некорельованих даних
const noCorrelations = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1]
];

const totalUncertaintyUncorrelated = combinedUncertainty(noCorrelations, uncertainties);
const expandedUncUncorrelated = expandedUncertainty(totalUncertaintyUncorrelated, coverageFactor1);

console.log(`Сумарна стандартна невизначеність для некорельованих даних: ${totalUncertaintyUncorrelated}`);
console.log(`Розширена невизначеність для некорельованих даних: ${expandedUncUncorrelated}`);

// Запис результатів вимірювання та складання бюджету невизначеності
const uncertaintyBudget = [
	{ source: 'Невизначеність типу А', value: totalUncertainty1, expanded: expandedUnc },
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
const expandedUncertainty1 = { source: 'Розширена невизначеність', value: expandedUncertainty(totalUncertainty.value, coverageFactor1) };

generateUncertaintyBudget([totalUncertainty], [expandedUncertainty1]);