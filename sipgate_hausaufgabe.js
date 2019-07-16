

/*
 * Since no symbol may occur more than three times (except m), the numbers 4,9,40,90,400,900 are represented by the subtraction (of roman numeral).
 */

const romanNumeralToIntegerMap = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1
};

/**
 * converts integer value to a roman numeral
 * @param int integerValue
 * @return string romanNumeral
 */

function convertIntegerValueToRomanNumeral(integerValue) {
  let romanNumeral = '';
  /*
  * We subtract the largest possible number, which can be represented in Roman
  * numerals, from the number entered, adding up the Roman numbers (the results
  * are written right to each other) until all numbers have been represented (integerValue = 0).
  */
  while (integerValue > 0) {
    for (var roman in romanNumeralToIntegerMap) {
      if (integerValue >= romanNumeralToIntegerMap[roman]) {
        integerValue = integerValue - romanNumeralToIntegerMap[roman];
        romanNumeral = romanNumeral + roman;
        break;
      }
    }
  }
  return romanNumeral;
}

/**
 * converts roman numeral to a integer value
 * @param string romanNumeral
 * @return int integerValue
 */
function convertRomanNumeralToIntegerValue(romanNumeral) {
  let integerValue = 0
  let currentValue = 0
  let nextValue = 0

  for (var i = 0; i < romanNumeral.length; i++) {
    currentValue = romanNumeralToIntegerMap[romanNumeral[i]]
    nextValue = romanNumeralToIntegerMap[romanNumeral[i + 1]]
    /*
    * if we are at the last charachter of the string or the decimal value
    * of the current roman numeral greater than the decimal value of the next
    * roman numeral, we add the decimal value to integerValue.
    */
    if (!nextValue || currentValue >= nextValue) {
      integerValue = integerValue + currentValue
    } else {
      /*
      * if the decimal value of the current roman numeral less than the decimal value of the next
      * roman numeral, we add the subtraction of nextValue and currentValue to integerValue
      * and we skip the next roman numeral.
      */
      integerValue = integerValue + (nextValue - currentValue)
      i++
    }
  }
  return integerValue
}

//convertIntegerValueToRomanNumeral test cases
console.log('34', convertIntegerValueToRomanNumeral(34));
console.log('777', convertIntegerValueToRomanNumeral(777));
console.log('334', convertIntegerValueToRomanNumeral(334));
console.log('4312', convertIntegerValueToRomanNumeral(4312));
console.log('4999', convertIntegerValueToRomanNumeral(4999));
console.log('5312', convertIntegerValueToRomanNumeral(5312));

//convertRomanNumeralToIntegerValue test cases
console.log('MMMMCMXCIX', convertRomanNumeralToIntegerValue('MMMMCMXCIX'));
console.log('MMMCDXXI', convertRomanNumeralToIntegerValue('MMMCDXXI'));
console.log('MMCCCXII', convertRomanNumeralToIntegerValue('MMCCCXII'));
console.log('DCCLXXI', convertRomanNumeralToIntegerValue('DCCLXXI'));
console.log('XII', convertRomanNumeralToIntegerValue('XII'));
