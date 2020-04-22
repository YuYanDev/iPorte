import React from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";

class AddRule extends React.Component {
  submit() {
    return this.props.form.getFieldsValue();
  }

  clear() {
    this.props.form.resetFields();
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
        <Form.Item label={"后缀"}>
          {getFieldDecorator("suffix", {
            rules: [
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label={"指向"}>
          {getFieldDecorator("target", {
            rules: [
              {
                required: true,
                message: "Please input the title of collection!",
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
  Form.create({ name: "add_domain" })(AddRule)
);
