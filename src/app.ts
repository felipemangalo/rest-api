import * as express from 'express';
import * as bodyParser from 'body-parser';
import { BankSlipController } from './controllers/bank-slip.controller';

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/boleto', BankSlipController);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
