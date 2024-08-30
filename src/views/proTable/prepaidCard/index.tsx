import { useEffect, useState } from "react";
import { Table, Button, Input, Space } from "antd";
// import useAuthButtons from "@/hooks/useAuthButtons";
import { PlusOutlined } from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import accountBanlance from "@/assets/images/accountbanlace.png";
import accountextra from "@/assets/images/accountbanlace.png";
import canuse from "@/assets/images/canuse.png";
import "./index.less";
import { UserCardApi } from "@/api/modules/prepaid"

const PrepaidCard = () => {
  // State to hold the card data
  const [dataSource, setDataSource] = useState([]);
  
  // Button permissions
  // const { BUTTONS } = useAuthButtons();
  const { Search } = Input;
  
  // Fetch data from the API on component mount
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const response = await UserCardApi(); 
				console.log(response);
				const formattedData = response.map(card => ({
          key: card.id,
          cardName: card.alias,
          cardOwner: "张三", // Replace with actual owner data if available
          cardGroup: card.network,
          cardNo: card.number, // Or card.last4 if you prefer to show only the last 4 digits
          cardStatus: "已冻结", // Replace with actual status if available
          banlance: '200.0', // Replace with actual balance if available
          createCardTime: '2024/06/11 14:50' // Replace with actual creation time if available
        }));
        setDataSource(formattedData ); // Adjust based on your API response structure
      } catch (error) {
        console.error("Failed to fetch user cards:", error);
      }
    };

    fetchUserCards();
  }, []);
  
  const columns: any[] = [
    {
      title: "卡片名称",
      dataIndex: "cardName",
      key: "cardName",
      align: "center"
    },
    {
      title: "持卡人",
      dataIndex: "cardOwner",
      key: "cardOwner",
      align: "center"
    },
    {
      title: "卡组",
      dataIndex: "cardGroup",
      key: "cardGroup",
      align: "center"
    }, {
      title: "卡号",
      dataIndex: "cardNo",
      key: "cardNo",
      align: "center"
    }, {
      title: "状态",
      dataIndex: "cardStatus",
      key: "cardStatus",
      align: "center"
    },
    {
      title: "余额",
      dataIndex: "banlance",
      key: "banlance",
      align: "center",
    },
    {
      title: "开卡时间",
      dataIndex: "createCardTime",
      key: "createCardTime",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "transactionDetail",
      key: "transactionDetail",
      align: "center",
      render: () => (
        <Space>
          <Button type="link" size="small">
            <NavLink to="/detail/index">查看详情</NavLink>
          </Button>
          <Button type="link" size="small">充值</Button>
        </Space>
      ),
    }
  ];

  const onSearch = (value, e, info) => console.log(info.source, value);

  return (
    <div className="card content-box">
      <div className="prepaidCardInfo">
        <div className="banlanceWrap">
          <span className="pre">沃易卡账户余额</span>
          <div className="amountWrap">
            <img src={accountBanlance} className="accountIcons" />
            <span className="amount">$ 100.0</span>
          </div>
        </div>
        <div className="banlanceWrap">
          <span className="pre">预付卡内总余额</span>
          <div className="amountWrap">
            <img src={accountextra} className="accountIcons" />
            <span className="amount">$ 100.0</span>
          </div>
        </div>
        <div className="banlanceWrap">
          <span className="pre">剩余可用开卡数</span>
          <div className="amountWrap">
            <img src={canuse} className="accountIcons" />
            <span className="amount">$ 100.0</span>
          </div>
        </div>
      </div>
      <div className="actionWrap">
        <div className="left">
          <span className="title">动帐明细</span>
          <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />
        </div>
        <Button type="primary" icon={<PlusOutlined />}>新增预付卡</Button>
      </div>
      <Table bordered={true} dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default PrepaidCard;
