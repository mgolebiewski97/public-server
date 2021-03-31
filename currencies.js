const currencyMap = new Map();
currencyMap.set('PLN', 'zł');
currencyMap.set('USD', '$');
currencyMap.set('EUR', '€');

document.getElementsByClassName('site-header')[0].innerHTML += '<div style="padding: 10px; display:flex;' +
  ' justify-content: center; align-items: center; position: absolute; top: 100px; z-index: 1;' +
  ' right: 100px; border-radius: 15px; background-color: lightgrey">' +
  '<select onchange="onCurrencySelectChange()" id="currency-select">' +
    '<option ' + (getSelectedCurrencyFromMemory() === 'PLN' ? 'selected' : '') + '>PLN</option>' +
    '<option ' + (getSelectedCurrencyFromMemory() === 'EUR' ? 'selected' : '') + '>EUR</option>' +
    '<option ' + (getSelectedCurrencyFromMemory() === 'USD' ? 'selected' : '') + '>USD</option>' +
  '</select>' +
  '</div>';
rewritePrices(document.getElementById('currency-select').value);

function onCurrencySelectChange() {
  let value = document.getElementById('currency-select').value;
  console.log(value)
  rewritePrices(value)
}

function getSelectedCurrencyFromMemory() {
  return localStorage.getItem('selected-currency')
}

function setSelectedCurrency(currency) {
  localStorage.setItem('selected-currency', currency)
}

function rewritePrices(newCurrencyCode) {
  let elements = Array.from(document.getElementsByClassName('money'));
  console.log(elements);
  for (let x = 0; x < elements.length; x++) {
    let value = document.getElementsByClassName('money')[x].innerHTML;
    let moneyValue = parseFloat(value.replace( /^\D+/g, '').replace(',', '.'));
    let currencySuffix = value.replace(/[0-9]/g, '').replace(/,/g,"").replace(/\./g,"").trim();
    let currencyCode = getKey(currencySuffix);
    setSelectedCurrency(newCurrencyCode);

    if (!isNaN(moneyValue)) {
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
