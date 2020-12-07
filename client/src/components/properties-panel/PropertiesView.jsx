import React, { Component } from 'react';
import PropertyPanelBuilder from './PropertiesPanelBuilder'


import './PropertiesView.css';

var applicationsList = [];

export default class PropertiesView extends Component {
  constructor(props) {
    super(props);
    this.applicationDropdownRef = React.createRef();
    this.state = {
      selectedElements: [],
      element: null,
    };
  }

  async fetchApplicationsFromDatabase() {
    return await fetch('/get-available-applications')
      .then((response) => response.json())
      .then(data => {
        return data;
      })
  };


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

      // update panel, if currently selected element changed
      if (element.id === currentElement.id) {
        this.setState({
          element,
        });
      }
    });
  }

  render() {
    const { modeler, application } = this.props;

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
