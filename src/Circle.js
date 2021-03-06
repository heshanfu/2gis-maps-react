import React, { PropTypes } from 'react'
import DG from '2gis-maps'
import MapComponent from './MapComponent'

export default class Circle extends MapComponent {
    static propsTypes = {
        style: PropTypes.object,
        pos: PropTypes.array,
        radius: PropTypes.number,
        label: PropTypes.string
    };

    state = {
        dgElement: null,
        childrenForRender: []
    };

    componentDidMount() {
        let dgElement = DG.circle(this.props.pos, this.props.radius);

        if (this.props.style) {
            dgElement.setStyle(this.props.style);
        }

        if (this.props.label) {
            dgElement.bindLabel(this.props.label);
        }

        this.setState({
            dgElement: dgElement
        });

        this.bindEvents(dgElement);

        this.props.element.addLayer(dgElement);
    }

    componentDidUpdate(prevProps) {
        let { dgElement } = this.state;

        this.updatePos(prevProps);

        if (this.checkPropsChange('radius', prevProps)) {
            dgElement.setRadius(this.props.radius);
        }

        this.updateLabel(prevProps);

        this.updateStyle(prevProps);

        this.updateEvents(dgElement, prevProps);
    }
}
