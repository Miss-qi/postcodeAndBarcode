'use strict';
const postnet = require("../../transfomer/postcodeAndBarcode.js");

describe('checkPostcodes', function () {
    it('it should return true', function () {
        let inputPostcodes = '95713';
        let isCorrect = postnet.checkPostcodes(inputPostcodes);
        expect(isCorrect).toBe(true);
    });
    it('it should return true', function () {
        let inputPostcodes = '95713-1234';
        let isCorrect = postnet.checkPostcodes(inputPostcodes);
        expect(isCorrect).toBe(true);
    });
    it('it should return false', function () {
        let inputPostcodes = '9571';
        let isCorrect = postnet.checkPostcodes(inputPostcodes);
        expect(isCorrect).toBe(false);
    });
    it('it should return false', function () {
        let inputPostcodes = '95713-12345';
        let isCorrect = postnet.checkPostcodes(inputPostcodes);
        expect(isCorrect).toBe(false);
    });
});

describe('getPostcodes', function () {
    let inputPostcodes;
    it('should return postcode if length more than 5', function () {
        inputPostcodes = '98732-1234';
        let postcodes = postnet.getPostcodes(inputPostcodes);
        expect(postcodes).toEqual([9, 8, 7, 3, 2, 1, 2, 3, 4]);
    });
    it('should return postcode if length equal 5', function () {
        inputPostcodes = '98732';
        let postcode = postnet.getPostcodes(inputPostcodes);
        expect(postcode).toEqual([9, 8, 7, 3, 2]);
    });
});

describe('getCheckcode', function () {
    let postcodes;
    it('should return getCheckcode', function () {
        let postcodes = [9, 8, 7, 3, 2];
        let postcodeList = postnet.getCheckcode(postcodes);
        expect(postcodeList).toEqual([9, 8, 7, 3, 2, 1]);
    });
});

describe('matchBarcodes', function () {
    it('should match barcode', function () {
        let postcodesList = [9, 5, 7, 1, 3, 5];
        let allBarcodes = postnet.loadAllBarcodes();
        let barcodes = postnet.matchBarcodes(postcodesList, allBarcodes);
        expect(barcodes).toEqual('||:|:::|:|:|:::|:::||::||::|:|:|');

    });
});

describe('postcodeToBarcode', function () {
    it('postcodeToBarcode test', function () {
        let inputPostcode = '95713';
        let allBarcodes = postnet.loadAllBarcodes();
        let barcode = postnet.postcodeToBarcode(inputPostcode, allBarcodes);
        expect(barcode).toEqual('||:|:::|:|:|:::|:::||::||::|:|:|');
    });
    it('postcodeToBarcode test', function () {
        let inputPostcode = '957136';
        let allBarcodes = postnet.loadAllBarcodes();
        let barcode = postnet.postcodeToBarcode(inputPostcode, allBarcodes);
        expect(barcode).toEqual('input errors');
    });
});

//barcode to postcode

describe('checkBarcodes', function () {
    let input;

    it('should return false when input valid barcodes', function () {
        input = ':|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| ||:::';
        const isCorrect = postnet.checkBarcodes(input);
        expect(isCorrect).toBe(false);
    });

    it('should return false when input valid barcodes', function () {
        input = ':|::| :|::|:|::|:|:|:||::::|:|::||:::::||::|:|::||::|::|||:::';
        const isCorrect = postnet.checkBarcodes(input);
        expect(isCorrect).toBe(false);
    });

    it('should return true when input correct barcodes', function () {
        input = '| :|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| ||::: |';
        const isCorrect = postnet.checkBarcodes(input);
        expect(isCorrect).toBe(true);
    });
});

describe('getBarcodeWithoutFrame', function () {
    let input;
    it('should return a string without frame', function () {
        input = '| :|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| ||::: |';
        let barcodeWithoutFrame = postnet.getBarcodeWithoutFrame(input);
        let result = [':|::|', ':|:|:', '||:::', ':|:|:', ':||::', ':::||', '::|:|', '::||:', ':|::|', '||:::'];
        expect(barcodeWithoutFrame).toEqual(result);
    });
});

describe('getDigits', function () {
    let barcodeList;
    it('should return digits', function () {
        barcodeList = [':|::|', ':|:|:', '||:::', ':|:|:', ':||::'];
        let allBarcodes = postnet.loadAllBarcodes();
        let digits = postnet.getDigits(barcodeList, allBarcodes);
        let result = [4, 5, 0, 5, 6];
        expect(digits).toEqual(result);
    });
});

describe('checkDigits', function () {
    it('should return true', function () {
        let digits = [9, 5, 7, 1, 3, 5];
        let isLegalCheckcode = postnet.checkDigits(digits);
        expect(isLegalCheckcode).toBeTruthy();
    });
    it('should return false', function () {
        let digits = [9, 5, 7, 1, 3, 4];
        let isLegalCheckcode = postnet.checkDigits(digits);
        expect(isLegalCheckcode).toBeFalsy();
    });
    it('should return true', function () {
        let digits = [4, 5, 0, 5, 6, 1, 2, 3, 4, 0];
        let isLegalCheckcode = postnet.checkDigits(digits);
        expect(isLegalCheckcode).toBeTruthy();
    });
});

describe('matchPostcodes', function () {
    it('should return postcodes', function () {
        let digits = [9, 5, 7, 1, 3, 5];
        let postcodes = postnet.matchPostcodes(digits);
        expect(postcodes).toEqual('95713');
    });
    it('should return postcodes', function () {
        let digits = [4, 5, 0, 5, 6, 1, 2, 3, 4, 0];
        let postcodes = postnet.matchPostcodes(digits);
        expect(postcodes).toEqual('45056-1234');
    });
});

describe('barcodeToPostcode', function () {
    let input;
    it('should return postcodes', function () {
        input = '| :|::| :|:|: ||::: :|:|: :||:: |';
        let postcodes = postnet.barcodeToPostcode(input);
        expect(postcodes).toEqual('45056');
    });
    it('should return postcodes', function () {
        input = '| :|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| ||::: |';
        let postcodes = postnet.barcodeToPostcode(input);
        expect(postcodes).toEqual('45056-1234');
    });
    it('should return a wrong input', function () {
        input = ':|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| ||:::';
        const isCorrect = postnet.barcodeToPostcode(input);
        expect(isCorrect).toEqual('a wrong input');
    });
    it('should return a wrong postcode', function () {
        input = '| :|::| :|:|: ||::: :|:|: :||:: :::|| ::|:| ::||: :|::| |:|:: |';
        const isCorrect = postnet.barcodeToPostcode(input);
        expect(isCorrect).toEqual('a wrong postcode');
    });
});
