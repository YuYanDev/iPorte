import React from "react";
import { Layout, Menu, Icon } from "antd";
import "./App.css";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  yearNow = new Date().getFullYear()

  render() {
    return (
      <div className="App">
        <Layout>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <div style={{ height: 36 }}>
                <p style={{ marginTop: 36, fontSize: "200%" }}>IPorte</p>
              </div>
              <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">nav 1</span>
              </Menu.Item>
              {/* <Menu.Item key="2">
                <Icon type="video-camera" />
                <span className="nav-text">nav 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span className="nav-text">nav 3</span>
              </Menu.Item> */}
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header style={{ background: "#fff", padding: 0 }} />
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div
                style={{ padding: 24, background: "#fff", textAlign: "center" }}
              >
                content
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              ©{this.yearNow} IPorte API Gateway
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default App;
