import React from "react";
import { connect } from "react-redux";
import { Table, Button, Badge, message, Modal } from "antd";
import {
  getApplicationList,
  addApplication,
  changeApplicationStatusById,
  deleteApplicationById,
  addApplicationRuleById,
  deleteApplicationRuleById,
} from "../../api/application";
import AddDomain from "./components/add-domain";
import AddRule from "./components/add-rule";

class Application extends React.Component {
  statusBadgeHashMap = {
    0: "error",
    1: "success",
  };
  statusTextHashMap = {
    0: "Stoped",
    1: "Running",
  };

  getDomainListColumns() {
    const lang = this.props.lang;
    return [
      {
        title: lang["application.table.head.domain_id"],
        dataIndex: "id",
        key: "id",
        width: 100,
      },
      {
        title: lang["application.table.head.name"],
        dataIndex: "name",
        key: "name",
        width: 150,
      },
      {
        title: lang["application.table.head.domain"],
        dataIndex: "domain",
        key: "domain",
        width: 200,
      },
      {
        title: lang["application.table.head.rule_count"],
        key: "rule",
        render: (text, record) => <span>{record.rule.length}</span>,
      },
      {
        title: lang["application.table.head.status"],
        key: "status",
        dataIndex: "status",
        width: 150,
        render: (text, record) => (
          <span>
            <Badge status={this.statusBadgeHashMap[text]} />
            {this.statusTextHashMap[text]}
          </span>
        ),
      },
      {
        title: lang["application.table.head.domain_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            <a
              onClick={() =>
                this.handleAddAndEditRuleModalOpen("add", record.id)
              }
            >
              {lang["application.table.add_rule"]}
            </a>
            {" | "}
            {/* <a
              className="warn-text"
              onClick={() =>
                this.handleAddAndEditDomainModalOpen("edit", record.id, record)
              }
            >
              {lang["common.text.modify"]}
            </a>
            {" | "} */}
            <a
              className="warn-text"
              onClick={() =>
                this.handleStopModalOpen(
                  "domain",
                  record.id,
                  record.name,
                  record.status
                )
              }
            >
              {record.status === 1
                ? lang["common.text.stop"]
                : lang["common.text.start"]}
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
        ),
      },
    ];
  }

  getForwardListColumns(pid) {
    const lang = this.props.lang;
    return [
      {
        title: lang["application.table.head.rule_id"],
        dataIndex: "id",
        key: "id",
        width: 100,
      },
      {
        title: lang["application.table.head.rule_name"],
        dataIndex: "name",
        key: "name",
        width: 150,
      },
      {
        title: lang["application.table.head.suffix"],
        dataIndex: "suffix",
        key: "suffix",
        width: 200,
      },
      {
        title: lang["application.table.head.type"],
        dataIndex: "type",
        key: "type",
      },
      {
        title: lang["application.table.head.target"],
        key: "target",
        dataIndex: "target",
      },
      // {
      //   title: lang["application.table.head.status"],
      //   key: "status",
      //   dataIndex: "status",
      //   width: 150,
      //   render: (text, record) => (
      //     <span>
      //       <Badge status={this.statusBadgeHashMap[text]} />
      //       {this.statusTextHashMap[text]}
      //     </span>
      //   )
      // },
      {
        title: lang["application.table.head.rule_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            {/* <a
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
            {" | "} */}
            <a
              className="error-text"
              onClick={() =>
                this.handleDropModalOpen("rule", record.id, record.name, pid)
              }
            >
              {lang["common.text.drop"]}
            </a>
          </span>
        ),
      },
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
    addAndEditRuleModalFatherId: null,
    addAndEditRuleModalId: null,
    addAndEditRuleModalData: {},
    /* stop domain or rule model state */
    stopModalVisible: false,
    stopModalType: "domain",
    stopModalTypeId: null,
    stopModalTypeName: "",
    stopModalTypeStatus: null,
    /* drop domain or rule model state */
    dropModalVisible: false,
    dropModalType: "domain",
    dropModalTypeId: null,
    dropModalTypePid: null,
    dropModalTypeName: "",
  };

  /**
   * add and edit domain model functions
   */
  addDomainRef = (ref) => {
    this.addDomainDom = ref;
  };
  handleAddAndEditDomainModalOpen = (type, id, data) => {
    if (type === "edit") {
      this.setState({
        addAndEditDomainModalVisible: true,
        addAndEditDomainModalType: "edit",
        addAndEditDomainModalId: id,
        addAndEditDomainModalData: data,
      });
    } else {
      this.setState({
        addAndEditDomainModalVisible: true,
        addAndEditDomainModalType: "add",
        addAndEditDomainModalId: null,
        addAndEditDomainModalData: {},
      });
    }
  };

  handleAddAndEditDomainModalOk = () => {
    const submitData = this.addDomainDom.submit();
    addApplication(submitData)
      .then(() => {
        this.handleAddAndEditDomainModalCancel();
        this.addDomainDom.clear();
        this.fetchApplicationList();
      })
      .catch((e) => {
        message.error(String(e));
      });
  };

  handleAddAndEditDomainModalCancel = () => {
    this.setState({
      addAndEditDomainModalVisible: false,
      addAndEditDomainModalType: "add",
      addAndEditDomainModalId: null,
      addAndEditDomainModalData: {},
    });
  };

  /**
   * add and edit rule model functions
   */
  addRuleRef = (ref) => {
    this.addRuleDom = ref;
  };
  handleAddAndEditRuleModalOpen = (type, pid, id, data) => {
    if (type === "edit") {
      this.setState({
        addAndEditRuleModalVisible: true,
        addAndEditRuleModalType: "edit",
        addAndEditRuleModalFatherId: pid,
        addAndEditRuleModalId: id,
        addAndEditRuleModalData: data,
      });
    } else {
      this.setState({
        addAndEditRuleModalVisible: true,
        addAndEditRuleModalType: "add",
        addAndEditRuleModalFatherId: pid,
        addAndEditRuleModalId: null,
        addAndEditRuleModalData: {},
      });
    }
  };

  handleAddAndEditRuleModalOk = () => {
    const submitData = this.addRuleDom.submit();
    const { addAndEditRuleModalFatherId } = this.state;
    addApplicationRuleById(submitData, addAndEditRuleModalFatherId)
      .then(() => {
        this.fetchApplicationList();
        this.handleAddAndEditRuleModalCancel();
        this.addRuleDom.clear();
      })
      .catch((e) => {
        message.error(String(e));
      });
  };

  handleAddAndEditRuleModalCancel = () => {
    this.setState({
      addAndEditRuleModalVisible: false,
      addAndEditRuleModalType: "add",
      addAndEditRuleModalFatherId: null,
      addAndEditRuleModalId: null,
      addAndEditRuleModalData: {},
    });
  };

  /**
   * stop domain or rule model functions
   */
  handleStopModalOpen = (type, id, name, status) => {
    this.setState({
      stopModalVisible: true,
      stopModalType: type,
      stopModalTypeId: id,
      stopModalTypeName: name,
      stopModalTypeStatus: status,
    });
  };

  handleStopModalOk = () => {
    const { lang } = this.props;
    const { stopModalTypeStatus, stopModalTypeId } = this.state;
    const newStatus = stopModalTypeStatus === 1 ? 0 : 1;
    changeApplicationStatusById({ status: newStatus, id: stopModalTypeId })
      .then((res) => {
        message.success(
          newStatus === 1
            ? lang["application.common.start_domain_success"]
            : lang["application.common.stop_domain_success"]
        );
        this.fetchApplicationList();
        this.handleStopModalCancel();
      })
      .catch((e) => {
        message.error(String(e));
      });
  };

  handleStopModalCancel = () => {
    this.setState({
      stopModalVisible: false,
      stopModalType: "domain",
      stopModalTypeId: null,
      stopModalTypeName: "",
      stopModalTypeStatus: null,
    });
  };

  /**
   * drop domain or rule model functions
   */
  handleDropModalOpen = (type, id, name, pid) => {
    this.setState({
      dropModalVisible: true,
      dropModalType: type,
      dropModalTypeId: id,
      dropModalTypePid: pid,
      dropModalTypeName: name,
    });
  };

  handleDropModalOk = () => {
    if (this.state.dropModalType === "domain") {
      deleteApplicationById({ id: this.state.dropModalTypeId })
        .then(() => {
          message.success(
            this.props.lang["application.common.drop_domain_success"]
          );
          this.fetchApplicationList();
          this.handleDropModalCancel();
        })
        .catch(() => {
          message.error(
            this.props.lang["application.common.drop_domain_unsuccess"]
          );
        });
    }
    if (this.state.dropModalType === "rule") {
      deleteApplicationRuleById(
        { id: this.state.dropModalTypeId },
        this.state.dropModalTypePid
      )
        .then((res) => {
          message.success(
            this.props.lang["application.common.drop_rule_success"]
          );
          this.fetchApplicationList();
          this.handleDropModalCancel();
        })
        .catch((e) => {
          message.error(
            this.props.lang["application.common.drop_rule_unsuccess"]
          );
        });
    }
  };

  handleDropModalCancel = () => {
    this.setState({
      dropModalVisible: false,
      dropModalType: "domain",
      dropModalTypeId: null,
      dropModalTypePid: null,
      dropModalTypeName: "",
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

  domainChildTable = (data) => {
    return (
      <Table
        columns={this.getForwardListColumns(data.id)}
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
            </Button>,
          ]}
        >
          <AddDomain onRef={this.addDomainRef} />
        </Modal>
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
            </Button>,
          ]}
        >
          <AddRule onRef={this.addRuleRef} />
        </Modal>
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
            </Button>,
          ]}
        >
          {this.state.stopModalType === "domain"
            ? this.state.stopModalTypeStatus === 1
              ? lang["application.common.stop_domain"]
              : lang["application.common.start_domain"]
            : this.state.stopModalTypeStatus === 1
            ? lang["application.common.stop_rule"]
            : lang["application.common.start_rule"]}
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
            </Button>,
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

const mapStateToProps = (store) => {
  return {
    lang: store.lang,
  };
};

export default connect(mapStateToProps)(Application);
