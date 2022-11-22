const Errors = {
  BadRequest: 'Bad request',
  Unauthorized: 'Unauthorized',
  FailedToSignIn: 'Username or password is incorrect',
  IncompleteInput: 'Please fill in all fields',
  DataNotFound: 'Data not found',

  EmailEmpty: 'Email cannot be empty',
  EmailNotFound: 'Email not found',
  LengthPassword: 'Password must have at least 8 characters',
  InvalidEmail: 'Invalid email',
  PasswordEmpty: 'Password cannot be empty',
  UserAlreadyExist: 'User already exist',
  UsernameAlreadyExist: 'Username already exist',
  UserNotFound: 'User not found',
  UsernameEmpty: 'Username cannot be empty',

  InvalidCurrency: 'Currency must be IDR',
  InvalidId: 'Invalid ID',
  NameEmpty: 'Name cannot be empty',
  NameOnlyLetters: 'Name contains only letters',
  NameAlreadyExists: 'Name already exists',
  BalanceEmpty: 'Balance cannot be empty',
  WalletNotFound: 'Wallet not found',
  DestinationWalletEmpty: 'Destination transfer cannot be empty',
  DestinationWalletNotFound: 'Destination transfer not found',
  UnableToDeleteWallet: 'Unable to delete a wallet',

  InvalidTypeTransaction: 'Transaction must be either both expense, income, and transfer',
  FailedToCreateTransaction: 'Failed to create a transaction',
  TransactionNotFound: 'Transaction not found',
};

export default Errors;
