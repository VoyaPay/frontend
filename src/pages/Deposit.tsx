const DepositPage = () => {
  return (
    <div className='text-center container'>
      <div className="row text-start">
        <div className="col-5 p-3 m-3 bg-white rounded-2">
          <h4 className='p-2'>Current Account</h4>
          <table className='table'>
            <tr className='align'>
              <th className='text-start'>Mobile Number</th>
              <td className='text-start'>+1 123-123-1234</td>
            </tr>
            <tr className='align'>
              <th className='text-start'>Account Number</th>
              <td className='text-start'>123123</td>
            </tr>
          </table>
        </div>
        <div className="col-6 m-3 p-3 bg-white rounded-2">
          <h4 className='p-2'>Client Bank Information</h4>
          <table className='table'>
            <tr className='align'>
              <th className='text-start'>Bank Location</th>
              <td className='text-start'>United States</td>
            </tr>
            <tr className='align'>
              <th className='text-start'>Account Holder's Name</th>
              <td className='text-start'>Cara Ding</td>
            </tr>
            <tr className='align'>
              <th className='text-start'>Bank Name</th>
              <td className='text-start'>JP Morgan Chase Bank, N.A. New York Branch </td>
            </tr>
            <tr className='align'>
              <th className='text-start'>Routing Number</th>
              <td className='text-start'>028000024</td>
            </tr>
            <tr className='align'>
              <th className='text-start'>Bank Account Number</th>
              <td className='text-start'>20000043421506</td>
            </tr>
          </table>
        </div>
      </div>

      <div className="row">
        <div className="text-start col-11 m-3 p-3 bg-white rounded-2">
          <h3>Deposit Instructions</h3>
          <ol>
            <li>Voyapay会根据您提供的付款账户信息为您入账，如需修改付款账户信息，请提前与专属客户经理联系，以免造成不必要的资金延误</li>
            <li>由于地区监管原因，VoyaPay暂时仅接受来自银行所在国家为United States的资金</li>
            <li>如有充值资金在途，请耐心等待，并联系您的付款银行</li>
            <li>VoyaPay充分保障您的钱包账户资金安全，如遇以下异常请联系您的专属7*24小时客户经理：12345678（微信同号）</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default DepositPage;
