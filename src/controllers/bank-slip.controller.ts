import { Router, Request, Response } from 'express';
import { BankSlipModule } from '../modules/bank-slip.module';

const router: Router = Router();

router.get('/:barcode', (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;
    const { amount, expirationDate, barCode } = new BankSlipModule(barcode);

    res.json({ amount, expirationDate, barCode });
  } catch (e) {
    res.status(400);
    res.json({ message: e.message });
  }
});

export const BankSlipController: Router = router;
