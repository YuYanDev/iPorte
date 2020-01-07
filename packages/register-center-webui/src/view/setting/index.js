import React from "react";
// import { Form, Input, Icon, Select } from "antd";
import { connect } from "react-redux";
import SettingForm from "./setting-form";

class Setting extends React.Component {
  render() {
    const lang = this.props.lang;
    return (
      <div>
        <div style={{ textAlign: "left", paddingBottom: 16 }}>
          <h1>{lang["common.nav.menu.setting"]}</h1>
        </div>
        <div>
          <SettingForm />
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    lang: store.lang
  };
};

export default connect(mapStateToProps)(Setting);
