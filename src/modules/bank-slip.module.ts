import * as moment from 'moment-timezone';
import { TypeBankSlipEnum } from '../enum/type-bank-slip.enum';
import { TypeBarcodeEnum } from '../enum/type-barcode.enum';

export class BankSlipModule {
  private _amount;
  private _expirationDate;
  private _barCode;

  constructor(barCode: string) {
    this._barCode = barCode;
  }

  public get barCode(): string {
    this._barCode = this.convetBarcodeFor44Digits();
    return this._barCode;
  }

  public get expirationDate(): Date {
    this._expirationDate = this.identifyExpirationDate();
    return this._expirationDate;
  }

  public get amount(): string {
    this._amount = this.identifyAmount();
    return this._amount;
  }

  identifyBarcodeType = (): TypeBarcodeEnum => {
    if (isNaN(this._barCode)) {
      throw new Error('Value passed does not correspond to a barcode.');
    } else if (this._barCode.length == 44) {
      return TypeBarcodeEnum.DIGITS_44;
    }
    if (
      this._barCode.length == 46 ||
      this._barCode.length == 47 ||
      this._barCode.length == 48
    ) {
      return TypeBarcodeEnum.UP_TO_48_DIGITS;
    } else {
      throw new Error(
        'The barcode does not have the exact amount of numbers to continue.',
      );
    }
  };

  identifyTypeBankSlipEnum = (): TypeBankSlipEnum => {
    const prodIdent = this._barCode.substring(0, 1);
    const segIdent = this._barCode.substring(1, 2);

    if (prodIdent === '8') {
      switch (segIdent) {
        case '1':
          return TypeBankSlipEnum.PREFEITURAS;
        case '2':
          return TypeBankSlipEnum.SANEAMENTO;
        case '3':
          return TypeBankSlipEnum.ENERGIA_ELETRICA_GAS;
        case '4':
          return TypeBankSlipEnum.TELECOMUNICACOES;
        case '5':
          return TypeBankSlipEnum.ORGAOS_GOVERNAMENTAIS;
        case '7':
          return TypeBankSlipEnum.MULTA_TRANSITO;
        default:
          return TypeBankSlipEnum.OUTROS;
      }
    } else return TypeBankSlipEnum.BANCO;
  };

  identifyAmount = (): string => {
    const typeBankSlip = this.identifyTypeBankSlipEnum();
    const typeBarcode = this.identifyBarcodeType();
    let finalAmount;

    if (typeBankSlip == TypeBankSlipEnum.BANCO) {
      if (typeBarcode == TypeBarcodeEnum.DIGITS_44) {
        const bankSlipAmount = this._barCode.substr(9, 10);
        finalAmount =
          parseInt(bankSlipAmount.substring(0, 8), 10) +
          '.' +
          bankSlipAmount.substring(8, 10);
      } else if (typeBarcode == TypeBarcodeEnum.UP_TO_48_DIGITS) {
        const bankSlipAmount = this._barCode.substr(37);
        finalAmount =
          parseInt(bankSlipAmount.substring(0, 8), 10) +
          '.' +
          bankSlipAmount.substring(8, 10);
      }
    } else {
      finalAmount = this.identifyAmountTaxCollection();
    }

    return parseFloat(finalAmount).toFixed(2);
  };

  identifyAmountTaxCollection = (): string => {
    const typeBarcode = this.identifyBarcodeType();
    const isEffectiveAmount = this.identifyEffectiveAmount().effective;

    let bankSlipAmount;
    let finalAmount;

    if (isEffectiveAmount) {
      if (typeBarcode == TypeBarcodeEnum.UP_TO_48_DIGITS) {
        let mountBankSlipAmount = this._barCode.substr(4, 12).split('');
        mountBankSlipAmount.splice(7, 1);
        bankSlipAmount = mountBankSlipAmount.join('');
      } else if (typeBarcode == TypeBarcodeEnum.DIGITS_44) {
        bankSlipAmount = this._barCode.substr(4, 11);
      }

      finalAmount =
        parseInt(bankSlipAmount.substring(0, 9), 10) +
        '.' +
        bankSlipAmount.substr(9, 10);
    } else {
      finalAmount = 0;
    }

    return finalAmount;
  };

  identifyEffectiveAmount = (): { mod: number; effective: boolean } => {
    const identEffectiveAmount = this._barCode.substr(2, 1);

    switch (identEffectiveAmount) {
      case '6':
        return {
          mod: 10,
          effective: true,
        };
      case '7':
        return {
          mod: 10,
          effective: false,
        };
      case '8':
        return {
          mod: 11,
          effective: true,
        };
      case '9':
        return {
          mod: 11,
          effective: false,
        };
    }
  };

  identifyExpirationDate = (): string => {
    const typeBarcode = this.identifyBarcodeType();
    const typeBankSlip = this.identifyTypeBankSlipEnum();

    let bankSlipExpirationDate = '0';
    const expirationDate = moment.tz('1997-10-07 20:54:59.000Z', 'UTC');

    if (typeBankSlip === TypeBankSlipEnum.BANCO) {
      if (typeBarcode === TypeBarcodeEnum.DIGITS_44) {
        bankSlipExpirationDate = this._barCode.substr(5, 4);
      }
      if (typeBarcode === TypeBarcodeEnum.UP_TO_48_DIGITS) {
        bankSlipExpirationDate = this._barCode.substr(33, 4);
      }
    } else {
      const barcode =
        typeBarcode === TypeBarcodeEnum.UP_TO_48_DIGITS
          ? this.convetBarcodeFor44Digits()
          : this._barCode;
      bankSlipExpirationDate = barcode.substr(33, 4);
    }
    expirationDate.add(Number(bankSlipExpirationDate), 'days');

    return expirationDate.format('YYYY-MM-DD');
  };

  convetBarcodeFor44Digits = (): string => {
    const typeBarcode = this.identifyBarcodeType();
    const typeBankSlip = this.identifyTypeBankSlipEnum();

    let result = this._barCode;

    if (typeBarcode === TypeBarcodeEnum.UP_TO_48_DIGITS)
      if (typeBankSlip === TypeBankSlipEnum.BANCO) {
        result =
          this._barCode.substr(0, 4) +
          this._barCode.substr(32, 1) +
          this._barCode.substr(33, 14) +
          this._barCode.substr(4, 5) +
          this._barCode.substr(10, 10) +
          this._barCode.substr(21, 10);
      } else {
        let barcodeMount = this._barCode.split('');
        barcodeMount.splice(11, 1);
        barcodeMount.splice(22, 1);
        barcodeMount.splice(33, 1);
        barcodeMount.splice(44, 1);
        barcodeMount = barcodeMount.join('');

        result = barcodeMount;
      }

    return result;
  };
}
