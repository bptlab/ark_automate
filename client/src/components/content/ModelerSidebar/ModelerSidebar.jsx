import styles from './ModelerSidebar.module.css';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';
import { Layout, Button } from 'antd';

const { Sider } = Layout;

/**
 * @description This component renders the modeling sidebar.
 * @category Client
 * @component
 */
const ModelerSidebar = (props) => {
  return (
    <Sider className={styles.sider}>
      {props.modeler && <PropertiesPanel modeler={props.modeler} />}
      <Button
        type='primary'
        className={styles.button}
        onClick={props.getRobotFile}
      >
        Get Robot file
      </Button>
    </Sider>
  );
};

export default ModelerSidebar;
