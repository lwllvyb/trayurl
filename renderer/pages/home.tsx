import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Layout,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Tree,
  TreeDataNode,
  MenuProps,
  Menu,
  Tabs,
  Input,
  FormProps,
} from 'antd'
import DirectoryTree from 'antd/lib/tree/DirectoryTree'
import {AppstoreOutlined, MailOutlined, SettingOutlined, FolderOpenFilled, MenuUnfoldOutlined, MenuFoldOutlined, FolderFilled} from '@ant-design/icons'

const { Header, Content } = Layout
const { Item: FormItem } = Form
const { Option } = Select

// type DirectoryTreeProps = GetProps<typeof DirectoryTree>;
// const treeData: TreeDataNode[] = [
//   {
//     title: 'parent 0',
//     key: '0-0',
//     children: [
//       { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
//       { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
//     ],
//   },
//   {
//     title: 'parent 1',
//     key: '0-1',
//     children: [
//       { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
//       { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
//     ],
//   },
// ];


// type MenuItem = Required<MenuProps>['items'][number];
// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: 'group',
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   } as MenuItem;
// }
// const items: MenuProps['items'] = [
//   getItem('Navigation One', 'sub1', <FolderOpenFilled />, [
//     getItem('Item 1', 'g1', <FolderOpenFilled />, [getItem('Option 1', '1'), getItem('Option 2', '2')]),
//     getItem('Item 2', 'g2', <FolderOpenFilled />, [getItem('Option 3', '3'), getItem('Option 4', '4')]),
//   ]),

//   getItem('Navigation Two', 'sub2', <FolderOpenFilled />, [
//     getItem('Option 5', '5'),
//     getItem('Option 6', '6'),
//     getItem('Submenu', 'sub3', <FolderOpenFilled />, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
//   ]),

//   { type: 'divider' },

//   getItem('Navigation Three', 'sub4', <FolderOpenFilled />, [
//     getItem('Option 9', '9'),
//     getItem('Option 10', '10'),
//     getItem('Option 11', '11'),
//     getItem('Option 12', '12'),
//   ]),

// ];
export default function HomePage() {
//   useEffect(() => {
//     window.ipc.on('message', (event, message) => {
//       console.log(event, message); // 接收并打印来自 Electron 主进程的消息
//     });
//   }, []);

//   const sendMessage = () => {
//     window.ipc.send('message', 'Hello from React');
//   };
//   // 状态用于控制选中的菜单项
//   const [current, setCurrent] = useState('1');
//   // 状态用于控制菜单项的展开和合并
//   const [openKeys, setOpenKeys] = useState([]);
//   const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
//     console.log('Trigger Select', keys, info);
//   };

//   const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
//     console.log('Trigger Expand', keys, info);
//   };
//   const onClick: MenuProps['onClick'] = (e) => {
//     console.log('click ', e);
//   };
//   const onOpenChange : MenuProps['onOpenChange'] = (keys) => {
//     // 最新展开的菜单项
//     const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
//     setOpenKeys(latestOpenKey ? [latestOpenKey] : []); 
//     console.log('openchagne:', keys);
//   };


//   const [collapsed, setCollapsed] = useState(false);

//   const toggleCollapsed = () => {
//     setCollapsed(!collapsed);
//   };
// type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
// const initialItems = [];
// const [activeKey, setActiveKey] = useState(initialItems.length > 0 ? initialItems[0].key : '');
// const [items, setItems] = useState(initialItems);
// const newTabIndex = useRef(0);

// const onChange = (newActiveKey: string) => {
//   setActiveKey(newActiveKey);
// };

// const add = () => {
//   const newActiveKey = `newTab${newTabIndex.current++}`;
//   const newPanes = [...items];
//   newPanes.push({ label: 'New Tab', children: 'Content of new Tab', key: newActiveKey });
//   setItems(newPanes);
//   setActiveKey(newActiveKey);
// };

// const remove = (targetKey: TargetKey) => {
//   let newActiveKey = activeKey;
//   let lastIndex = -1;
//   items.forEach((item, i) => {
//     if (item.key === targetKey) {
//       lastIndex = i - 1;
//     }
//   });
//   const newPanes = items.filter((item) => item.key !== targetKey);
//   if (newPanes.length && newActiveKey === targetKey) {
//     if (lastIndex >= 0) {
//       newActiveKey = newPanes[lastIndex].key;
//     } else {
//       newActiveKey = newPanes[0].key;
//     }
//   }
//   setItems(newPanes);
//   setActiveKey(newActiveKey);
// };

// const onEdit = (
//   targetKey: React.MouseEvent | React.KeyboardEvent | string,
//   action: 'add' | 'remove',
// ) => {
//   if (action === 'add') {
//     add();
//   } else {
//     remove(targetKey);
//   }
// };


// form
const onFinish: FormProps["onFinish"] = (values) => {
  window.ipc.send('current_url', `{"id": 1, "url": "${values["URL"]}"}`);
  console.log('Success:', values["URL"]);
};

const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

// URL
const [url, setUrl] = useState('');
useEffect(() => {
    console.log("useEffect enter", window, window.ipc);
   // 设置事件监听器
   const removeListener = window.ipc.on('reply_url', (reply_url:string) => {
    console.log('reply_url', reply_url);
    setUrl(reply_url);
  });

  // 组件卸载时移除事件监听器
  return () => {
    removeListener();
  };
}, [])
const onInputChange = (e) =>{
  setUrl(e.target.value);
}
const onPressEnter = (e) => {
  console.log("Enter: ", url, window, window.ipc);
  window.ipc.send('current_url', `{"id": 1, "url": "${url}"}`);
};
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-ant-design)</title>
      </Head>
{/* 
      <Header>
        <Link href="/next">
          <a>Go to next page</a>
        </Link>
        <Link href="/juchats">
          <a>Go to juchats page</a>
        </Link>
      </Header> */}

      <Content style={{ padding: 5 }}>
      {/* <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    /> */}
    <Input
    type="text"
      value={url}
      addonBefore="https://"
      onChange={onInputChange}
      onPressEnter={onPressEnter}
    ></Input>
    {/* <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="URL"
      name="URL"
      rules={[{ required: true, message: 'Please input your URL!' }]}
    >
      <Input />
    </Form.Item>
  </Form> */}
      {/* <div className="App">
      <header className="App-header">
        <p>Send a message to Electron:</p>
        <button onClick={sendMessage}>Send Message</button>
      </header>
    </div> */}
    {/* <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
    /> */}
    {/* <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 1 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    <Menu
      onClick={onClick}
      onOpenChange={onOpenChange}
      openKeys={openKeys}
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      inlineCollapsed={collapsed}
      items={items}
    /> */}
        {/* <Form layout="horizontal">
          <FormItem
            label="Input Number"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <InputNumber
              size="large"
              min={1}
              max={10}
              style={{ width: 100 }}
              defaultValue={3}
              name="inputNumber"
            />
            <a href="#">Link</a>
          </FormItem>

          <FormItem
            label="Switch"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Switch defaultChecked />
          </FormItem>

          <FormItem
            label="Slider"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Slider defaultValue={70} />
          </FormItem>

          <FormItem
            label="Select"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <Select size="large" defaultValue="lucy" style={{ width: 192 }}>
              <Option value="jack">jack</Option>
              <Option value="lucy">lucy</Option>
              <Option value="disabled" disabled>
                disabled
              </Option>
              <Option value="yiminghe">yiminghe</Option>
            </Select>
          </FormItem>

          <FormItem
            label="DatePicker"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <DatePicker name="startDate" />
          </FormItem>
          <FormItem
            style={{ marginTop: 48 }}
            wrapperCol={{ span: 8, offset: 8 }}
          >
            <Button size="large" type="primary" htmlType="submit">
              OK
            </Button>
            <Button size="large" style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </FormItem>
        </Form> */}
      </Content>
    </React.Fragment>
  )
}
