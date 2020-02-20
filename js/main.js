"use strict";

const DAY_ARRAY = ['День', 'Дня', 'Дней'];

const DATA = {
    whichSite: ['landing', 'multiPage', 'onlineStore'],
    price: [4000, 8000, 26000],
    desktopTemplates: [50, 40, 30],
    adapt: 20,
    mobileTemplates: 15,
    editable: 10,
    metrikaYandex: [500, 1000, 2000],
    analyticsGoogle: [850, 1350, 3000],
    sendOrder: 500,
    deadlineDay: [
        [2, 7], [3, 10], [7, 14]
    ],
    deadlinePercent: [20, 17, 15]
};

const startButton = document.querySelector('.start-button'),
    firstScreen = document.querySelector('.first-screen'),
    mainForm = document.querySelector('.main-form'),
    formCalculate = document.querySelector('.form-calculate'),
    endButton = document.querySelector('.end-button'),
    total = document.querySelector('.total'),
    fastRange = document.querySelector('.fast-range'),
    rangeDeadline = document.querySelector('.range-deadline'),
    totalPriceSum = document.querySelector('.total_price__sum'),
    adapt = document.querySelector('#adapt'),
    mobileTemplates = document.querySelector('#mobileTemplates'),
    typeSite = document.querySelector('.type-site'),
    maxDeadline = document.querySelector('.max-deadline'),
    deadlineValue = document.querySelector('.deadline-value'),
    buttonListYesNo = document.querySelectorAll('.switcher input:not(.want-faster)'),
    labelListYesNo = document.querySelectorAll('.switcher input:not(.want-faster) ~ .checkbox-label');

function declOfNum(n, titles) {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
}

function showElem (elem) {
    elem.style.display = 'block';
}

function hideElem (elem) {
    elem.style.display = 'none';
}

function renderTextContent(result, site, maxDay) {

    totalPriceSum.textContent = result.toString();
    typeSite.textContent = site;
    maxDeadline.textContent = declOfNum(maxDay, DAY_ARRAY);

    if (fastRange.style.display === 'none') {
        rangeDeadline.value = rangeDeadline.max;
    }
    deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_ARRAY);
}

function priceCalculation(elem) {
    let result = 0,
        index = 0,
        options = [],
        site = '',
        maxDeadlineDay = DATA.deadlineDay[index][1];

    if (elem.name === 'whichSite') {
        for (const item of formCalculate.elements) {
            if (item.type === 'checkbox') {
                item.checked = false;
            }
        }
        hideElem(fastRange);
    }
    for (const item of formCalculate.elements) {
        if (item.name === 'whichSite' && item.checked) {
            index = DATA.whichSite.indexOf(item.value);

            site = item.dataset.site;
            maxDeadlineDay = DATA.deadlineDay[index][1];

            rangeDeadline.min = DATA.deadlineDay[index][0];
            rangeDeadline.max = DATA.deadlineDay[index][1];

            /* I have put this code here, because it is not text rendering*/

        } else if (item.classList.contains('calc-handler') && item.checked) {
            options.push(item.value);
        }
    }

    options.forEach(function(key){
        if (typeof(DATA[key]) === 'number') {
            if (key === 'sendOrder') {
                result += DATA[key];
            } else {
                result += DATA.price[index] * DATA[key] /100;
            }
        } else {
            if (key === 'desktopTemplates') {
                result += DATA.price[index] * DATA.desktopTemplates[index] /100;
            } else {
                result += DATA[key][index] ;
            }
        }
    });

    result += DATA.price[index];

    renderTextContent(result, site, maxDeadlineDay);
}

function handlerCallBackForm(event) {
    const target = event.target;

    if (target.classList.contains('want-faster')) {
        if (target.checked) {
            showElem(fastRange);
        } else {
            hideElem(fastRange);
        }
    }

    mobileTemplates.disabled = !adapt.checked;

    if (target.classList.contains('calc-handler')){
        priceCalculation(target);
    }
}

startButton.addEventListener('click', function () {
    showElem(mainForm);
    hideElem(firstScreen);
});

endButton.addEventListener('click', function () {
    for (const elem of formCalculate.elements) {
        if (elem.tagName.toUpperCase() === 'FIELDSET') {hideElem(elem);}
        showElem(total);
    }
});

formCalculate.addEventListener('change', handlerCallBackForm);


for (let idx = 0; idx < buttonListYesNo.length; idx ++) {

    buttonListYesNo[idx].addEventListener('change', function() {
        console.log(idx);
        labelListYesNo[idx].textContent = buttonListYesNo[idx].checked ? 'Да' : 'Нет';
    });

}