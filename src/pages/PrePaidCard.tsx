import { useEffect, useState } from "react";
import { getToken } from "../api/auth";
import { fetchWrapper } from "../api/fetch.wrapper";
import { formatUsdCurrency } from "../utils/format";
import { format as dateFormat } from "date-fns";

interface ICard {
  id: number;
  last4: string;
  createdAt: string;
  initialLimit: number;
  expirationDate: string;
  status: string;
}

const PrePaidCardPage = () => {
  const [cards, setCards] = useState<ICard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const cards = await fetchWrapper("/cards", {}, getToken());
        setCards(cards);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-8">
          <h1>PrePaid Cards List</h1>
        </div>
        <div className="col-4 text-end">
          <button type="button" className="btn btn-primary">
            Request New Card
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover table-primary align-middle">
          <thead className="table-light">
            <tr>
              <th>Card Number</th>
              <th>Created At</th>
              <th>Initial Limit</th>
              <th>Expiration</th>
              <th>Status</th>
              <th/>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {isLoading ? (
              <tr>
                <td colSpan={5}>loading...</td>
              </tr>
            ) : (
              cards.map((card: ICard) => (
                <tr className={'table-primary'} key={card.id}>
                  <td>***{card.last4}</td>
                  <td>{dateFormat(new Date(card.createdAt), "MM-dd-yyyy")}</td>
                  <td>{formatUsdCurrency(card.initialLimit.toString())}</td>
                  <td>
                    {dateFormat(new Date(card.expirationDate), "MM-dd-yyyy")}
                  </td>
                  <td>{card.status}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-success">Details</button>{' '}
                    {card.status === 'Active'
                      ? <button type="button" className="btn btn-sm btn-danger">Cancel</button>
                      : <></>
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
};

export default PrePaidCardPage;
