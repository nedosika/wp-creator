import { Button, Form, Input, Space, Layout, Icon } from 'antd';
import styles from "./App.module.css";

const { Header, Footer, Sider, Content } = Layout;

const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const App = () => (
    <div className={styles.LoginHeader}>
        <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
          <Form.Item>
            <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}
                placeholder="Username"
            />
          </Form.Item>

          <Form.Item>
            <Input
                type="password"
                placeholder="Password"
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
    </div>
);
export default App;