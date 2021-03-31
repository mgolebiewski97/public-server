
document.getElementsByClassName('site-header')[0].innerHTML += '<div style="padding: 10px; display:flex;' +
  ' justify-content: center; align-items: center; position: absolute; top: 100px; z-index: 1;' +
  ' right: 100px; border-radius: 15px; background-color: lightgrey">' +
  '<select onchange="onCurrencySelectChange()" id="currency-select">' +
    '<option selected="' + getSelectedCurrencyFromMemory() === 'PLN' ? 'seleceted' : '' ' +">PLN</option>' +
    '<option selected="selected">EUR</option>' +
    '<option>USD</option>' +
  '</select>' +
  '</div>';


function onCurrencySelectChange() {
  let value = document.getElementById('currency-select').value
  console.log(value)
  rewritePrices(value)
}

function getSelectedCurrencyFromMemory() {
  return localStorage.getItem('selected-currency')
}

function setSelectedCurrency(currency) {
  localStorage.setItem('selected-currency', currency)
}

var currencyMap = new Map();
currencyMap.set('PLN', 'zł')
currencyMap.set('USD', '$')
currencyMap.set('EUR', '€')

function calculateAmount(value, toCurrency, fromCurrency) {
  console.log(value);

  return parseFloat(value.replace(',', '.')) * 2.0;
}

function rewritePrices(newCurrencyCode) {
  let elements = Array.from(document.getElementsByClassName('money'))
  console.log(elements);
  for (let x = 0; x < elements.length; x++) {
    let value = document.getElementsByClassName('money')[x].innerHTML
    let moneyValue = parseFloat(value.replace( /^\D+/g, '').replace(',', '.'))
    let currencySuffix = value.replace(/[0-9]/g, '').replace(/,/g,"").replace(/\./g,"").trim();
    let currencyCode = getKey(currencySuffix)

    if (!isNaN(roundedMoneyValue)) {
      let url = "http://api.openrates.io/latest?base=" + currencyCode;
      console.log(url);
      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          document.getElementsByClassName('money')[x].innerHTML =
            Math.round((res.rates[newCurrencyCode] * moneyValue + Number.EPSILON) * 100) / 100 + ' ' + currencyMap.get(newCurrencyCode)
        })
    }
  }
}

function getKey(val) {
  let results = [...currencyMap].find(([key, value]) => val === value);
  return results ? results[0] : ''
}
