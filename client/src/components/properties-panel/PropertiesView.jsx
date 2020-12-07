import React, { Component } from 'react';
import PropertyPanelBuilder from './PropertiesPanelBuilder'
import './PropertiesView.css';

/**
 * @class
 * @component
 * @classdesc This class decides which sidebar is displayed. It updates itself depending on the number of selected BPMN elements.
 * @example return (<PropertiesView />)
 * 
 * @description Initializes state based on properties. 
 */

export default class PropertiesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedElements: [],
      element: null,
    };
  }

  /** 
   * @description
   * On a changed selection, the selected element changed in the components state.
   * We also update panel via .setState, if currently selected element changed.
   */
  componentDidMount() {
    const { modeler } = this.props;

    modeler.on('selection.changed', (e) => {
      const { element } = this.state;

      this.setState({
        selectedElements: e.newSelection,
        element: e.newSelection[0],
      });
    });

    modeler.on('element.changed', (e) => {
      const { element } = e;
      const { element: currentElement } = this.state;

      if (!currentElement) {
        return;
      }

      if (element.id === currentElement.id) {
        this.setState({
          element,
        });
      }
    });
  }

  render() {
    const { modeler } = this.props;
    const { selectedElements, element } = this.state;

    return (
      <div>
        {selectedElements.length === 1 && (
          <PropertyPanelBuilder modeler={modeler} element={element} />
        )}

        {selectedElements.length === 0 && (
          <span>Please select an element.</span>
        )}

        {selectedElements.length > 1 && (
          <span>Please select a single element.</span>
        )}
      </div>
    );
  }
}