function calculateMean(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
}

function standardUncertaintyTypeA(data) {
    const mean = calculateMean(data);
    const sumOfSquares = data.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0);
    return Math.sqrt(sumOfSquares / (data.length - 1)) / Math.sqrt(data.length);
}

function standardUncertaintyTypeB(fixedValue) {
    return fixedValue / Math.sqrt(3);
}

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

function combinedUncertainty(correlations, uncertainties) {
    let sumSquared = uncertainties.reduce((acc, u) => acc + u * u, 0);
    for (let i = 0; i < correlations.length; i++) {
        for (let j = i + 1; j < correlations.length; j++) {
            sumSquared += 2 * correlations[i][j] * uncertainties[i] * uncertainties[j];
        }
    }
    return Math.sqrt(sumSquared);
}

function expandedUncertainty(standardUncertainty, coverageFactor) {
    return standardUncertainty * coverageFactor;
}

// Данные из таблиц
const temperatureData = [
    91.5, 92, 91.5, 91, 91, 91.5, 92, 92, 92, 92.5,
    92.5, 93, 93, 93.5, 93, 93, 92.5, 92.5, 92.5, 92,
    92.5, 92.5, 92, 92.5, 92, 91.5, 91.5, 92, 92.5, 93
];

const pressureData = [
    597, 593, 596, 599, 599, 599, 596, 596, 599, 599,
    599, 596, 596, 599, 599, 602, 602, 599, 599, 596,
    599, 599, 599, 596, 599, 599, 602, 599, 599, 599
];

const humidityData = [
    97, 97, 96, 96, 98, 97, 96, 97, 95, 95,
    96, 96, 97, 97, 97, 98, 98, 98, 97, 98,
    98, 97, 98, 98, 97, 99, 98, 98, 97, 97
];

// Обчислення середніх значень
const meanTemp = calculateMean(temperatureData);
const meanPressure = calculateMean(pressureData);
const meanHumidity = calculateMean(humidityData);

console.log("Вивід середніх значень для кожного масиву:", meanTemp, meanPressure, meanHumidity);

// Обчислення стандартних невизначеностей типу А
const uATemp = standardUncertaintyTypeA(temperatureData);
const uAPressure = standardUncertaintyTypeA(pressureData);
const uAHumidity = standardUncertaintyTypeA(humidityData);

console.log(`Стандартні невизначеності типу А для масивів: ${uATemp.toFixed(6)}, ${uAPressure.toFixed(6)}, ${uAHumidity.toFixed(6)}`);

// Фиксированные значения для стандартной неопределенности типа B
const fixedValueTemp = 0.5;  // Примерное значение для температуры
const fixedValuePressure = 1.0;  // Примерное значение для давления
const fixedValueHumidity = 0.5;  // Примерное значение для влажности

// Пересчет значений
const uBTemp = standardUncertaintyTypeB(fixedValueTemp);
const uBPressure = standardUncertaintyTypeB(fixedValuePressure);
const uBHumidity = standardUncertaintyTypeB(fixedValueHumidity);

console.log(`Стандартні невизначеності типу В для масивів: ${uBTemp.toFixed(6)}, ${uBPressure.toFixed(6)}, ${uBHumidity.toFixed(6)}`);

// Перевірка на наявність кореляції між масивами даних
const correlationTP = pearsonCorrelation(temperatureData, pressureData);
const correlationTH = pearsonCorrelation(temperatureData, humidityData);
const correlationPH = pearsonCorrelation(pressureData, humidityData);

console.log(`Коефіцієнти кореляції: T-P: ${correlationTP.toFixed(6)}, T-H: ${correlationTH.toFixed(6)}, P-H: ${correlationPH.toFixed(6)}`);

// Оцінка сумарної стандартної невизначеності
const correlations = [
    [1, correlationTP, correlationTH],
    [correlationTP, 1, correlationPH],
    [correlationTH, correlationPH, 1]
];

const uncertaintiesA = [uATemp, uAPressure, uAHumidity];  // Значення невизначеностей типу А
const uncertaintiesB = [uBTemp, uBPressure, uBHumidity];  // Значення невизначеностей типу В

const totalUncertaintyA = combinedUncertainty(correlations, uncertaintiesA);
console.log(`Сумарна стандартна невизначеність типу А: ${totalUncertaintyA.toFixed(6)}`);

const totalUncertaintyB = combinedUncertainty(correlations, uncertaintiesB);
console.log(`Сумарна стандартна невизначеність типу В: ${totalUncertaintyB.toFixed(6)}`);

// Оголошення totalUncertainty для використання в розрахунках
const totalUncertainty = { source: 'Сумарна невизначеність', value: totalUncertaintyA };

// Розрахунок розширеної невизначеності
const coverageFactor = 2;
const expandedUncA = expandedUncertainty(totalUncertainty.value, coverageFactor);
console.log(`Розширена невизначеність для корельованих даних: ${expandedUncA.toFixed(6)}`);

const expandedUncB = expandedUncertainty(totalUncertaintyB, coverageFactor);
console.log(`Розширена невизначеність для корельованих даних типу В: ${expandedUncB.toFixed(6)}`);

// Оцінювання сумарної невизначеності для некорельованих даних
const noCorrelations = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
];

const totalUncertaintyUncorrelated = combinedUncertainty(noCorrelations, uncertaintiesA);
const expandedUncUncorrelated = expandedUncertainty(totalUncertaintyUncorrelated, coverageFactor);

console.log(`Сумарна стандартна невизначеність для некорельованих даних: ${totalUncertaintyUncorrelated.toFixed(6)}`);
console.log(`Розширена невизначеність для некорельованих даних: ${expandedUncUncorrelated.toFixed(6)}`);

// Запис результатів вимірювання та складання бюджету невизначеності
const uncertaintyBudget = [
    { source: 'Невизначеність типу А', value: totalUncertainty.value, expanded: expandedUncA },
    { source: 'Невизначеність типу В', value: totalUncertaintyB, expanded: expandedUncB }
];

console.log("Бюджет невизначеності:");
uncertaintyBudget.forEach(item => {
    console.log(`${item.source}: Стандартна невизначеність = ${item.value.toFixed(6)}, Розширена невизначеність = ${item.expanded.toFixed(6)}`);
});

function generateUncertaintyBudget(uncertainties, expandedUncertainties) {
    console.log("Бюджет невизначеності:");
    console.log("Джерело невизначеності, Стандартна невизначеність, Розширена невизначеність");
    uncertainties.forEach((u, index) => {
        console.log(`${u.source}: ${u.value.toFixed(3)}, ${expandedUncertainties[index].value.toFixed(3)}`);
    });
}

const expandedUncertainty1 = { source: 'Розширена невизначеність', value: expandedUncertainty(totalUncertainty.value, coverageFactor) };

generateUncertaintyBudget([totalUncertainty], [expandedUncertainty1]);
