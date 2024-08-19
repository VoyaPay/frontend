import { useEffect, useState } from "react";
import { fetchWrapper } from "../api/fetch.wrapper";
import { getToken } from "../api/auth";
import { formatDateTime, formatUsdCurrency } from "../utils/format";
import { Link } from 'react-router-dom';

interface ITransfer {
  id: string;
  amount: number;
  type: string;
  processedAt: string;
}
interface IMyAccountData {
  currentBalance: number;
  lastTransfers: ITransfer[];
}

const MyAccountPage = () => {
  const [data, setData] = useState<IMyAccountData>({
    currentBalance: 0,
    lastTransfers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // https://www.robinwieruch.de/react-hooks-fetch-data/
  useEffect(() => {
    const fetchBalanceAndTransfers = async () => {
      setIsLoading(true);
      try {
        const [getBalance, getTransfers] = await Promise.all([
          fetchWrapper("/ledger/balance", {}, getToken()),
          fetchWrapper("/ledger", {}, getToken()),
        ]);

        setData({
          currentBalance: getBalance.currentBalance,
          lastTransfers: getTransfers,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceAndTransfers();
  }, []);

  return (
    <>
      <div className="row bg-primary m-3">
        <div className="col-9 text-center p-md-4">
          <span className="fs-4 row text-light ">Voyapay Account Balance</span>
          <span className="fs-1 row text-light ">
            {isLoading
              ? '...' 
              : formatUsdCurrency(data.currentBalance.toString())
            }
          </span>
        </div>
        <div className="col-3 text-end">
          <Link to="/deposit">
            <button className="btn btn-light btn-lg mt-lg-4">Deposit</button>
          </Link>
        </div>
      </div>

      <div className="table-responsive-md m-3">
        <table className="table custom-table">
          <thead className="">
            <tr>
              <th scope="col">Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {isLoading
              ? <tr><td colSpan={4}>loading...</td></tr>
              : data.lastTransfers.map((transfer) => (
              <tr className='' key={transfer.id}>
                <td scope="row">{formatDateTime(transfer.processedAt)}</td>
                <td>{transfer.type}</td>
                <td>{formatUsdCurrency(transfer.amount.toString())}</td>
                <td>{transfer.id}</td>
              </tr>
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>

      {/* <div className="row container mt-5">
      <div className='fs-4'>预留位置：运营活动</div>
      <img src={blueBanner} alt="blue-banner" className="img-fluid" />
    </div> */}
    </>
  );
};

export default MyAccountPage;
