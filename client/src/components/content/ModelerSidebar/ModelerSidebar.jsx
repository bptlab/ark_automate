import styles from './ModelerSidebar.module.css';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';
import { Layout, Button } from 'antd';

const { Sider } = Layout;

const ModelerSidebar = (props) => {
  return (
    <Sider className={styles.sider}>
      {props.modeler && <PropertiesPanel modeler={props.modeler} />}
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
