import React from "react";
import { connect } from "react-redux";
import { Table, Button } from "antd";
import { getApplicationList } from "../../api/application";

class Application extends React.Component {
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
        render: (text, record) => <span>{record.rule.length}</span>
      },
      {
        title: lang["application.table.head.domain_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            <a>{lang["application.table.add_rule"]}</a>&nbsp;|&nbsp;
            <a className="warn-text">{lang["common.text.modify"]}</a>
            &nbsp;|&nbsp;
            <a className="warn-text">{lang["common.text.stop"]}</a>&nbsp;|&nbsp;
            <a className="error-text">{lang["common.text.drop"]}</a>
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
        title: lang["application.table.head.rule_operate"],
        key: "action",
        width: 240,
        align: "right",
        render: (text, record) => (
          <span>
            <a className="warn-text">{lang["common.text.modify"]}</a>
            &nbsp;|&nbsp;
            <a className="warn-text">{lang["common.text.stop"]}</a>&nbsp;|&nbsp;
            <a className="error-text">{lang["common.text.drop"]}</a>
          </span>
        )
      }
    ];
  }

  state = {
    applicationList: []
  };

  async fetchApplicationList() {
    let applicationList = await getApplicationList();
    this.setState({ applicationList });
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
          <Button type="primary" icon="plus">
            {lang["application.body.add_domain"]}
          </Button>
        </div>
        <Table
          columns={this.getDomainListColumns()}
          expandedRowRender={this.domainChildTable}
          dataSource={this.state.applicationList}
        />
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
