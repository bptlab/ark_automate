import React, { useState, useEffect } from 'react';
import PropertiesPanelView from '../PropertiesPanelView/PropertiesPanelView';
import './PropertiesView.css';

import { Typography } from 'antd';

const { Title } = Typography;

/**
 * @component
 * @description This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * @example return (<PropertiesView />)
 * @description Initializes state based on properties.
 */

const PropertiesView = (props) => {
  const [selectedElements, setSelectedElements] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);

  /**
   * @description
   * On a changed selection, the selected element changed in the components state.
   * We also update panel via .setState, if currently selected element changed.
   */
  useEffect(() => {
    props.modeler.on('selection.changed', (event) => {
      setSelectedElements(event.newSelection);
      setCurrentElement(event.newSelection[0]);
    });

    props.modeler.on('element.changed', (event) => {
      const { element } = event;
      console.log(element);
      console.log(currentElement);

      if (!currentElement) {
        return;
      }

      if (element.id === currentElement.id) {
        setCurrentElement(element);
      }
    });
  }, []);

  return (
    <div className='sidebarWrapper'>
      {selectedElements.length === 1 && (
        <PropertiesPanelView modeler={props.modeler} element={currentElement} />
      )}

      {selectedElements.length === 0 && (
        <span>
          <Title className='label-on-dark-background'>
            Please select an element.
          </Title>
        </span>
      )}

      {selectedElements.length > 1 && (
        <span>
          <Title className='label-on-dark-background'>
            Please select a single element.
          </Title>
        </span>
      )}
    </div>
  );
};

export default PropertiesView;
