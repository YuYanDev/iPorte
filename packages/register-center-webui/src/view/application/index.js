import React from "react";
import { connect } from "react-redux";
import { Table, Button, Badge, Modal } from "antd";
import { getApplicationList } from "../../api/application";

class Application extends React.Component {
  statusHashMap = {
    Stop: "error",
    Running: "success"
  };

  getDomainListColumns() {
    const lang = this.props.lang;
    return [
      {
        title: lang["application.table.head.domain_id"],
        dataIndex: "id",
        key: "id",
        width: 100
      },
      {
        title: lang["application.table.head.name"],
        dataIndex: "name",
        key: "name",
        width: 150
      },
      {
        title: lang["application.table.head.domain"],
        dataIndex: "domain",
        key: "domain",
        width: 200
      },
      {
        title: lang["application.table.head.rule_count"],
        key: "rule",
        render: (text, record) => <span>{record.rule.length}</span>
      },
      {
        title: lang["application.table.head.status"],
        key: "status",
        dataIndex: "status",
        width: 150,
        render: (text, record) => (
          <span>
            <Badge status={this.statusHashMap[text]} />
            {text}
          </span>
        )
      },
      {
        title: lang["application.table.head.domain_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleAddAndEditRuleModalOpen("add")}>
              {lang["application.table.add_rule"]}
            </a>
            {" | "}
            <a
              className="warn-text"
              onClick={() =>
                this.handleAddAndEditDomainModalOpen("edit", record.id, record)
              }
            >
              {lang["common.text.modify"]}
            </a>
            {" | "}
            <a
              className="warn-text"
              onClick={() =>
                this.handleStopModalOpen("domain", record.id, record.name)
              }
            >
              {lang["common.text.stop"]}
            </a>
            {" | "}
            <a
              className="error-text"
              onClick={() =>
                this.handleDropModalOpen("domain", record.id, record.name)
              }
            >
              {lang["common.text.drop"]}
            </a>
          </span>
        )
      }
    ];
  }

  getForwardListColumns() {
    const lang = this.props.lang;
    return [
      {
        title: lang["application.table.head.rule_id"],
        dataIndex: "id",
        key: "id",
        width: 100
      },
      {
        title: lang["application.table.head.rule_name"],
        dataIndex: "name",
        key: "name",
        width: 150
      },
      {
        title: lang["application.table.head.suffix"],
        dataIndex: "suffix",
        key: "suffix",
        width: 200
      },
      {
        title: lang["application.table.head.type"],
        dataIndex: "type",
        key: "type"
      },
      {
        title: lang["application.table.head.rewrite"],
        key: "rewrite",
        render: (text, record) => (record.rewrite ? record.rewrite_rule : "-")
      },
      {
        title: lang["application.table.head.target"],
        key: "target",
        dataIndex: "target"
      },
      {
        title: lang["application.table.head.status"],
        key: "status",
        dataIndex: "status",
        width: 150,
        render: (text, record) => (
          <span>
            <Badge status={this.statusHashMap[text]} />
            {text}
          </span>
        )
      },
      {
        title: lang["application.table.head.rule_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            <a
              className="warn-text"
              onClick={() =>
                this.handleAddAndEditRuleModalOpen("edit", record.id, record)
              }
            >
              {lang["common.text.modify"]}
            </a>
            {" | "}
            <a
              className="warn-text"
              onClick={() =>
                this.handleStopModalOpen("rule", record.id, record.name)
              }
            >
              {lang["common.text.stop"]}
            </a>
            {" | "}
            <a
              className="error-text"
              onClick={() =>
                this.handleDropModalOpen("rule", record.id, record.name)
              }
            >
              {lang["common.text.drop"]}
            </a>
          </span>
        )
      }
    ];
  }

  state = {
    applicationList: [],
    /* add and edit domain model state */
    addAndEditDomainModalVisible: false,
    addAndEditDomainModalType: "add",
    addAndEditDomainModalId: null,
    addAndEditDomainModalData: {},
    /* add and edit domain rule state */
    addAndEditRuleModalVisible: false,
    addAndEditRuleModalType: "add",
    addAndEditRuleModalId: null,
    addAndEditRuleModalData: {},
    /* stop domain or rule model state */
    stopModalVisible: false,
    stopModalType: "domain",
    stopModalTypeId: null,
    stopModalTypeName: "",
    /* drop domain or rule model state */
    dropModalVisible: false,
    dropModalType: "domain",
    dropModalTypeId: null,
    dropModalTypeName: ""
  };

  /**
   * add and edit domain model functions
   */
  handleAddAndEditDomainModalOpen = (type, id, data) => {
    if (type === "edit") {
      this.setState({
        addAndEditDomainModalVisible: true,
        addAndEditDomainModalType: "edit",
        addAndEditDomainModalId: id,
        addAndEditDomainModalData: data
      });
    } else {
      this.setState({
        addAndEditDomainModalVisible: true,
        addAndEditDomainModalType: "add",
        addAndEditDomainModalId: null,
        addAndEditDomainModalData: {}
      });
    }
  };

  handleAddAndEditDomainModalOk = () => {
    this.handleAddAndEditDomainModalCancel();
  };

  handleAddAndEditDomainModalCancel = () => {
    this.setState({
      addAndEditDomainModalVisible: false,
      addAndEditDomainModalType: "add",
      addAndEditDomainModalId: null,
      addAndEditDomainModalData: {}
    });
  };

  /**
   * add and edit rule model functions
   */
  handleAddAndEditRuleModalOpen = (type, id, data) => {
    if (type === "edit") {
      this.setState({
        addAndEditRuleModalVisible: true,
        addAndEditRuleModalType: "edit",
        addAndEditRuleModalId: id,
        addAndEditRuleModalData: data
      });
    } else {
      this.setState({
        addAndEditRuleModalVisible: true,
        addAndEditRuleModalType: "add",
        addAndEditRuleModalId: null,
        addAndEditRuleModalData: {}
      });
    }
  };

  handleAddAndEditRuleModalOk = () => {
    this.handleAddAndEditRuleModalCancel();
  };

  handleAddAndEditRuleModalCancel = () => {
    this.setState({
      addAndEditRuleModalVisible: false,
      addAndEditRuleModalType: "add",
      addAndEditRuleModalId: null,
      addAndEditRuleModalData: {}
    });
  };

  /**
   * stop domain or rule model functions
   */
  handleStopModalOpen = (type, id, name) => {
    this.setState({
      stopModalVisible: true,
      stopModalType: type,
      stopModalTypeId: id,
      stopModalTypeName: name
    });
  };

  handleStopModalOk = () => {
    this.handleStopModalCancel();
  };

  handleStopModalCancel = () => {
    this.setState({
      stopModalVisible: false,
      stopModalType: "domain",
      stopModalTypeId: null,
      stopModalTypeName: ""
    });
  };

  /**
   * drop domain or rule model functions
   */
  handleDropModalOpen = (type, id, name) => {
    this.setState({
      dropModalVisible: true,
      dropModalType: type,
      dropModalTypeId: id,
      dropModalTypeName: name
    });
  };

  handleDropModalOk = () => {
    this.handleDropModalCancel();
  };

  handleDropModalCancel = () => {
    this.setState({
      dropModalVisible: false,
      dropModalType: "domain",
      dropModalTypeId: null,
      dropModalTypeName: ""
    });
  };

  /**
   * other function
   */
  async fetchApplicationList() {
    let applicationList = await getApplicationList();
    this.setState({ applicationList: applicationList.data.applications });
  }

  componentDidMount() {
    this.fetchApplicationList();
  }

  domainChildTable = data => {
    return (
      <Table
        columns={this.getForwardListColumns()}
        dataSource={data.rule}
        pagination={false}
      />
    );
  };

  render() {
    const lang = this.props.lang;
    return (
      <div>
        <div style={{ textAlign: "left", paddingBottom: 16 }}>
          <h1>{lang["common.nav.menu.application"]}</h1>
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.handleAddAndEditDomainModalOpen("add")}
          >
            {lang["application.body.add_domain"]}
          </Button>
        </div>
        <Table
          columns={this.getDomainListColumns()}
          expandedRowRender={this.domainChildTable}
          dataSource={this.state.applicationList}
        />
        {/**
         * add/edit domain modal
         */}
        <Modal
          visible={this.state.addAndEditDomainModalVisible}
          onOk={this.handleAddAndEditDomainModalOk}
          onCancel={this.handleAddAndEditDomainModalCancel}
          title={
            (this.state.addAndEditDomainModalType === "add"
              ? lang["common.text.add"]
              : lang["common.text.edit"]) + lang["application.common.domain"]
          }
          footer={[
            <Button key="back" onClick={this.handleAddAndEditDomainModalCancel}>
              {lang["common.text.cancel"]}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleAddAndEditDomainModalOk}
            >
              {lang["common.text.submit"]}
            </Button>
          ]}
        ></Modal>
        {/**
         * add/edit rule modal
         */}
        <Modal
          visible={this.state.addAndEditRuleModalVisible}
          onOk={this.handleAddAndEditRuleModalOk}
          onCancel={this.handleAddAndEditRuleModalCancel}
          title={
            (this.state.addAndEditRuleModalType === "add"
              ? lang["common.text.add"]
              : lang["common.text.edit"]) + lang["application.common.rule"]
          }
          footer={[
            <Button key="back" onClick={this.handleAddAndEditRuleModalCancel}>
              {lang["common.text.cancel"]}
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleAddAndEditRuleModalOk}
            >
              {lang["common.text.submit"]}
            </Button>
          ]}
        ></Modal>
        {/**
         * stop modal
         */}
        <Modal
          visible={this.state.stopModalVisible}
          onOk={this.handleStopModalOk}
          onCancel={this.handleStopModalCancel}
          footer={[
            <Button key="back" onClick={this.handleStopModalCancel}>
              {lang["common.text.cancel"]}
            </Button>,
            <Button
              key="submit"
              type="danger"
              ghost
              onClick={this.handleStopModalOk}
              style={{ borderColor: "#faad14", color: "#faad14" }}
            >
              {lang["common.text.confirm"]}
            </Button>
          ]}
        >
          {this.state.stopModalType === "domain"
            ? lang["application.common.stop_domain"]
            : lang["application.common.stop_rule"]}
        </Modal>
        {/**
         * drop modal
         */}
        <Modal
          visible={this.state.dropModalVisible}
          onOk={this.handleDropModalOk}
          onCancel={this.handleDropModalCancel}
          footer={[
            <Button key="back" onClick={this.handleDropModalCancel}>
              {lang["common.text.cancel"]}
            </Button>,
            <Button
              key="submit"
              type="danger"
              ghost
              onClick={this.handleDropModalOk}
              style={{ borderColor: "#f5222d", color: "#f5222d" }}
            >
              {lang["common.text.confirm"]}
            </Button>
          ]}
        >
          {this.state.dropModalType === "domain"
            ? lang["application.common.drop_domain"]
            : lang["application.common.drop_rule"]}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    lang: store.lang
  };
};

export default connect(mapStateToProps)(Application);
