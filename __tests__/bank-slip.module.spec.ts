import { TypeBankSlipEnum } from '../src/enum/type-bank-slip.enum';
import { TypeBarcodeEnum } from '../src/enum/type-barcode.enum';
import { BankSlipModule } from '../src/modules/bank-slip.module';

describe('BankSlipModule', () => {
  describe('getters', () => {
    describe('barCode', () => {
      it('returns the barcode with 44 digits', () => {
        const mockBarcode = '21290001192110001210904475617405975870000002000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.barCode).toEqual(
          '21299758700000020000001121100012100447561740',
        );
      });
    });
    describe('expirationDate', () => {
      it('returns the expirationDate', () => {
        const mockBarcode = '21290001192110001210904475617405975870000002000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.expirationDate).toEqual('2018-07-16');
      });
    });
    describe('amount', () => {
      it('returns the expirationDate', () => {
        const mockBarcode = '21290001192110001210904475617405975870000002000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.amount).toEqual('20.00');
      });
    });
  });

  describe('functions', () => {
    describe('identifyBarcodeType', () => {
      it('returns the error when the value passed is not a number', () => {
        const mockBarcode = '12345.31231.1233452sa';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(() => {
          bankSlipModule.identifyBarcodeType();
        }).toThrowError('Value passed does not correspond to a barcode.');
      });
      it('returns the error when the value is missing number', () => {
        const mockBarcode = '21290001192110001210904475617405975870000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(() => {
          bankSlipModule.identifyBarcodeType();
        }).toThrowError(
          'The barcode does not have the exact amount of numbers to continue.',
        );
      });

      it('returns the barcode type UP_TO_48_DIGITS', () => {
        const mockBarcode = '21290001192110001210904475617405975870000002000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyBarcodeType()).toEqual(
          TypeBarcodeEnum.UP_TO_48_DIGITS,
        );
      });

      it('returns the barcode type DIGITS_44', () => {
        const mockBarcode = '21299758700000020000001121100012100447561740';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyBarcodeType()).toEqual(
          TypeBarcodeEnum.DIGITS_44,
        );
      });
    });

    describe('identifyTypeBankSlipEnum', () => {
      it('returns the bank slip type PREFEITURAS', () => {
        const mockBarcode = '818200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.PREFEITURAS,
        );
      });
      it('returns the bank slip type SANEAMENTO', () => {
        const mockBarcode = '828200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.SANEAMENTO,
        );
      });
      it('returns the bank slip type ENERGIA_ELETRICA_GAS', () => {
        const mockBarcode = '838200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.ENERGIA_ELETRICA_GAS,
        );
      });
      it('returns the bank slip type TELECOMUNICACOES', () => {
        const mockBarcode = '848200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.TELECOMUNICACOES,
        );
      });
      it('returns the bank slip type ORGAOS_GOVERNAMENTAIS', () => {
        const mockBarcode = '858200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.ORGAOS_GOVERNAMENTAIS,
        );
      });
      it('returns the bank slip type OUTROS', () => {
        const mockBarcode = '868200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.OUTROS,
        );
      });
      it('returns the bank slip type MULTA_TRANSITO', () => {
        const mockBarcode = '878200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.MULTA_TRANSITO,
        );
      });

      it('returns the bank slip type BANCO', () => {
        const mockBarcode = '21299758700000020000001121100012100447561740';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyTypeBankSlipEnum()).toEqual(
          TypeBankSlipEnum.BANCO,
        );
      });
    });

    describe('identifyAmount', () => {
      it('returns amount with barcode type UP_TO_48_DIGITS and bank slip type BANCO ', () => {
        const mockBarcode = '21290001192110001210904475617405975870000002000';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmount()).toEqual('20.00');
      });

      it('returns amount with barcode type DIGITS_44 and bank slip type BANCO ', () => {
        const mockBarcode = '21299758700000020000001121100012100447561740';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmount()).toEqual('20.00');
      });

      it('returns amount with bank slip type ORGAOS_GOVERNAMENTAIS ', () => {
        const mockBarcode = '858200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmount()).toEqual('22.41');
      });
    });

    describe('identifyAmountTaxCollection', () => {
      it('returns identifyAmountTaxCollection with bank slip type ORGAOS_GOVERNAMENTAIS ', () => {
        const mockBarcode = '858200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmountTaxCollection()).toEqual('22.41');
      });

      it('returns identifyAmountTaxCollection with bank slip type ORGAOS_GOVERNAMENTAIS and 44 digits ', () => {
        const mockBarcode = '85820000000224102701201000008362589162022013';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmountTaxCollection()).toEqual('22.41');
      });
      it('returns identifyAmountTaxCollection with barcode type DIGITS_44 and bank slip type BANCO ', () => {
        const mockBarcode = '257200000007224102701202100000836253891620220133';
        const bankSlipModule = new BankSlipModule(mockBarcode);

        expect(bankSlipModule.identifyAmountTaxCollection()).toEqual(0);
      });
    });
  });
});
