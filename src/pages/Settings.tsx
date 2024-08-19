import { useEffect, useState } from 'react'
import { MeInfo, getMe } from '../api/auth';
import { formatDateTime } from '../utils/format';
import { format as dateFormat } from 'date-fns';

const SettingsPage = () => {

  const [meInfo, setMeInfo] = useState({} as MeInfo);

useEffect(() => {
  let mounted = true;
  getMe().then((data) => {
    if (mounted)
      setMeInfo(data);
  })
  return () => {
    mounted = false;
  }
}, [])
  
  return (
    <div>
      <h1>My Settings</h1>
      <table className='table'>
        <tbody>
          <tr>
            <td>Id</td>
            <td>{meInfo?.id}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{meInfo?.email}</td>
          </tr>
          <tr>
            <td>Full Name</td>
            <td>{meInfo?.fullName}</td>
          </tr>
          <tr>
            <td>Last Login</td>
            <td>{formatDateTime(meInfo?.lastLogin)}</td>
          </tr>
          <tr>
            <td>Created At</td>
            <td>{formatDateTime(meInfo?.createdAt)}</td>
          </tr>
          <tr>
            <td>Token Expires At</td>
            <td>
            {meInfo.sessionExpiration
                  ? dateFormat(new Date(meInfo.sessionExpiration), 'Pp')
                  : 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SettingsPage
