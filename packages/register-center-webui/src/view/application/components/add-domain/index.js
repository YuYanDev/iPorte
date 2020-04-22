import React from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";

class AddDomain extends React.Component {
  submit() {
    return this.props.form.getFieldsValue();
  }

  clear(){
    this.props.form.resetFields()
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const lang = this.props.lang;

    return (
      <Form layout={"inline"}>
        <Form.Item label={lang["application.common.name"]}>
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={lang["application.common.domain"]}>
          {getFieldDecorator("domain", {
            rules: [
              {
                required: true,
                message: "Please input the title of collection!",
              },
              {
                validator: (rule, value, callback) => {
                  const url = this.props.form.getFieldValue("domain");
                  const matchRegex =
                    "(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9].)+[a-zA-Z]{2,63}$)";
                  const matchReg = new RegExp(matchRegex);
                  return matchReg.test(url) && url.split("/")[1].trim() === ""
                    ? callback()
                    : callback("illgare");
                },
                message: "域名不合法",
              },
            ],
          })(<Input />)}
        </Form.Item>
      </Form>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    lang: store.lang,
  };
};

export default connect(mapStateToProps)(
  Form.create({ name: "add_domain" })(AddDomain)
);
