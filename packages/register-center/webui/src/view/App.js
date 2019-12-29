import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Redirect, HashRouter as Router, Route } from "react-router-dom";
import { connect } from "react-redux";
import { getUserInfo } from "../api/common";

import Application from "./application";
import Setting from "./setting";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  yearNow = new Date().getFullYear();

  state = {
    username: ""
  };

  async componentDidMount() {
    let userData = await getUserInfo();
    this.setState({ ...userData });
  }

  switchRouter = info => {
    window.location.hash = "/" + info.key;
  };

  render() {
    return (
      <div className="App">
        <Layout>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              zIndex: 100
            }}
          >
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[this.props.navbarkey]}
              onClick={this.switchRouter}
            >
              <div style={{ height: 36 }}>
                <p
                  style={{
                    marginTop: 36,
                    fontSize: "200%",
                    textAlign: "center"
                  }}
                >
                  IPorte
                </p>
              </div>
              <Menu.Item key="application">
                <Icon type="unordered-list" />
                <span className="nav-text">
                  {this.props.lang["common.nav.menu.application"]}
                </span>
              </Menu.Item>
              <Menu.Item key="setting">
                <Icon type="setting" />
                <span className="nav-text">
                  {this.props.lang["common.nav.menu.setting"]}
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200, minWidth: "1200px" }}>
            <Header style={{ background: "#fff", padding: 0 }}>
              <p style={{ textAlign: "right", marginRight: "20px" }}>
                Hi, {this.state.username}
              </p>
            </Header>
            <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
              <div
                style={{ padding: 24, background: "#fff", textAlign: "center" }}
              >
                <Router>
                  <Redirect from="/" to="/application" />
                  <Route path="/application" component={Application} />
                  <Route path="/setting" component={Setting} />
                </Router>
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

const mapStateToProps = store => {
  return {
    lang: store.lang,
    navbarkey: store.navbarkey
  };
};

export default connect(mapStateToProps)(App);
