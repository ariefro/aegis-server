import { TopUp, Transfer } from '../constants';
import rupiah from './formatRupiah';

function createNotificationMessage(
  slug,
  amount,
  nameOfSourceWallet,
  nameOfDestinationTransfer,
  nameOfTransaction,
) {
  const formatRupiah = rupiah(amount);

  let message;
  if (slug === TopUp) {
    message = `You have received ${formatRupiah} from ${nameOfTransaction}`;
  } else if (slug === Transfer) {
    message = `You have transfered ${formatRupiah} from ${nameOfSourceWallet} to ${nameOfDestinationTransfer} for ${nameOfTransaction}`;
  } else {
    message = `You have spent ${formatRupiah} for ${nameOfTransaction}`;
  }

  return message;
}

export default createNotificationMessage;
