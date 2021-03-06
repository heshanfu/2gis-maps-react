import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server';
import DG from '2gis-maps'
import MapComponent from './MapComponent'

export default class Popup extends MapComponent {
    static propsTypes = {
        pos: PropTypes.array,
        maxWidth: PropTypes.number,
        minWidth: PropTypes.number,
        maxHeight: PropTypes.number,
        sprawling: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        maxWidth: 300,
        minWidth: 50,
        maxHeight: null,
        sprawling: false,
        className: ''
    };

    componentDidMount() {
        const popupHtml = this.renderChildren();

        let { element } = this.props;

        let dgElement = null;

        // Popup options.
        const {
            maxWidth, minWidth, maxHeight, sprawling, className
        } = this.props;

        let options = {
            maxWidth, minWidth, maxHeight, sprawling, className
        };

        if (this.insideMap()) {
            dgElement = DG.popup(options)
                .setLatLng(this.props.pos)
                .setContent(popupHtml)
                .openOn(element);
        } else {
            if (element.getPopup()) {
                element.setPopupContent(popupHtml);
            }
            else {
                element.bindPopup(popupHtml, options);
            }

            dgElement = element.getPopup()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let { element } = this.props;

        if (prevProps.children != this.props.children) {
            const popupHtml = this.renderChildren();

            if (this.insideMap()) {
                element.getPopup().setContent(popupHtml)
            }
            else {
                element.setPopupContent(popupHtml);
            }
        }

        this.updatePos(prevProps);

        if (element.getPopup) {
            this.updateEvents(element.getPopup());
        }
    }

    componentWillUnmount() {
        this.props.element.unbindPopup();
    }

    renderChildren() {
        return ReactDOMServer.renderToString(
            <div style={{
                padding: 0,
                margin: 0,
                display: 'inline'
            }}>{ this.props.children }</div>
        );
    }
}
