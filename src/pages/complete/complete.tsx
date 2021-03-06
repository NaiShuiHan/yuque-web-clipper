import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from 'components/container';
import * as styles from './complete.scss';
import { Button } from 'antd';
import { asyncRemoveTool } from 'actions';
import { GlobalStore } from '../../store/reducers/interface';
import Section from 'components/section';

const useActions = {
  asyncRemoveTool: asyncRemoveTool.started,
};

const mapStateToProps = ({
  clipper: { completeStatus, currentAccountId },
  userPreference: { accounts, servicesMeta },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    servicesMeta,
    currentAccount,
    completeStatus,
  };
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps> {
  renderComplete = () => {};

  renderError = () => (
    <ToolContainer
      onClickCloseButton={() => {
        this.props.asyncRemoveTool();
      }}
    >
      <a
        target="_blank"
        href="https://github.com/yuquewebclipper/yuque-web-clipper/issues"
      >
        发生错误
      </a>
    </ToolContainer>
  );

  render() {
    const { completeStatus, currentAccount, servicesMeta } = this.props;

    if (!completeStatus || !currentAccount) {
      return this.renderError();
    }
    const currentService = servicesMeta[currentAccount.type];
    if (!currentService) {
      return this.renderError();
    }
    const { name, complete: Complete } = currentService;

    return (
      <ToolContainer
        onClickCloseButton={() => {
          this.props.asyncRemoveTool();
        }}
      >
        <Section title="保存成功">
          <a
            className={styles.menuButton}
            href={completeStatus.href}
            target="_blank"
          >
            <Button style={{ marginTop: 16 }} size="large" type="primary" block>
              前往<span>{name}</span> 查看
            </Button>
          </a>
        </Section>
        {Complete && <Complete status={completeStatus}> </Complete>}
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
