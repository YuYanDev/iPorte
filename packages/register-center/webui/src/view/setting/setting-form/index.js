import React from "react";
import { Form, Input, Icon, Select } from "antd";
import { connect } from "react-redux";
import language from "../../../img/language.svg";
import "./index.scss";

const { Option } = Select;

class SettingForm extends React.Component {
  languageList = [
    {
      value: "zh_CN",
      text: "简体中文"
    },
    {
      value: "en_US",
      text: "English"
    }
  ];
  
  formItemLayout = {
    labelCol: { span: 1 },
  };

  changeLanguage = event => {
    this.props.setLang(event);
  };

  render() {
    const languageOptions = this.languageList.map(d => (
      <Option key={d.value}>{d.text}</Option>
    ));
    return (
      <Form {...this.formItemLayout}>
        <Form.Item label={<img src={language} />} style={{ textAlign: "left" }}>
          <Select
            defaultValue={this.props.lang["now"]}
            style={{ width: 120 }}
            onChange={this.changeLanguage}
          >
            {languageOptions}
          </Select>
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = store => {
  return {
    lang: store.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLang: lang => dispatch({ type: "SET_LANG", lang })
  };
};

export default Form.create({ name: "setting" })(
  connect(mapStateToProps, mapDispatchToProps)(SettingForm)
);
