import { useEffect, useState } from "react";
import { getToken } from "../api/auth";
import { fetchWrapper } from "../api/fetch.wrapper";
import { formatUsdCurrency } from "../utils/format";
import { format as dateFormat } from "date-fns";

interface ITransaction {
  id: string;
  status: string;
  transactionTime: Date;
  amount: number;
  merchantName: string;
  cardId:string
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const transactions = await fetchWrapper("/transactions", {}, getToken());

        setTransactions(transactions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <div>
      <h1>Card Transactions</h1>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-borderless table-primary align-middle">
          <thead className="table-light">
            <tr>
              <th>Created</th>
              <th>Merchant</th>
              <th>amount</th>
              <th>status</th>
              <th>card</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {isLoading
            ? <tr><td colSpan={5}>loading...</td></tr>
            : transactions.map((transaction: ITransaction) => (
              <tr className="table-primary" key={transaction.id}>
                <td>{dateFormat(new Date(transaction.transactionTime), "MM-dd-yyyy")}</td>
                <td>{transaction.merchantName}</td>
                <td>{formatUsdCurrency(transaction.amount.toString())}</td>
                <td>{transaction.status}</td>
                <td>{transaction.cardId.substring(0,4)}</td>
              </tr>))}
            </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
