import styles from './ModelerSidebar.module.css';
import PropertiesView from '../PropertiesPanel/PropertiesView/PropertiesView';
import { Layout, Button } from 'antd';

const { Sider } = Layout;

const ModelerSidebar = (props) => {
  return (
    <Sider className={styles.sider}>
      {props.modeler && <PropertiesView modeler={props.modeler} />}
      <Button
        type='primary'
        style={{
          width: '80%',
          marginTop: '10px',
          marginLeft: '30px',
          marginRight: '30px',
        }}
        onClick={props.getBpmnDiagramRobot}
      >
        Get Robot file
      </Button>
    </Sider>
  );
};

export default ModelerSidebar;
