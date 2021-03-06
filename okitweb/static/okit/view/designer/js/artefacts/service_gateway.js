/*
** Copyright (c) 2020, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Designer ServiceGateway View Javascript');

/*
** Define ServiceGateway View Artifact Class
 */
class ServiceGatewayView extends OkitDesignerArtefactView {
    constructor(artefact=null, json_view) {
        super(artefact, json_view);
    }

    get parent_id() {return this.artefact.vcn_id;}

    getParent() {
        return this.getJsonView().getVirtualCloudNetwork(this.parent_id);
    }

    getParentId() {
        return this.parent_id;
    }

    /*
     ** SVG Processing
     */
    draw() {
        console.log('Drawing ' + this.getArtifactReference() + ' : ' + this.id + ' [' + this.parent_id + ']');
        let me = this;
        let svg = super.draw();
        // Get Inner Rect to attach Connectors
        let rect = svg.select("rect[id='" + safeId(this.id) + "']");
        let boundingClientRect = rect.node().getBoundingClientRect();
        // Add Connector Data
        svg.attr("data-connector-start-y", boundingClientRect.y + boundingClientRect.height / 2)
            .attr("data-connector-start-x", boundingClientRect.x + (boundingClientRect.width))
            .attr("data-connector-end-y", boundingClientRect.y + boundingClientRect.height / 2)
            .attr("data-connector-end-x", boundingClientRect.x + (boundingClientRect.width))
            .attr("data-connector-id", this.id)
            .attr("dragable", true)
            .selectAll("*")
            .attr("data-connector-start-y", boundingClientRect.y + boundingClientRect.height / 2)
            .attr("data-connector-start-x", boundingClientRect.x + (boundingClientRect.width))
            .attr("data-connector-end-y", boundingClientRect.y + boundingClientRect.height / 2)
            .attr("data-connector-end-x", boundingClientRect.x + (boundingClientRect.width))
            .attr("data-connector-id", this.id)
            .attr("dragable", true);
        // Draw Connectors
        this.drawConnectors();
        console.log();
        return svg;
    }

    drawConnectors() {
        console.log('Drawing Connectors for ' + this.getArtifactReference() + ' : ' + this.id + ' [' + this.parent_id + ']');
        // Get Grand Parent
        let grandparent_id = d3.select(d3Id(this.parent_id)).attr('data-parent-id');
        // Define Connector Parent
        let parent_svg = d3.select(d3Id(grandparent_id + "-svg"));
        let parent_rect = d3.select(d3Id(grandparent_id));
        parent_svg = d3.select(d3Id('canvas-svg'));
        parent_rect = d3.select(d3Id('canvas-rect'));
        // Only Draw if parent exists
        if (parent_svg.node()) {
            console.info('Parent SVG     : ' + parent_svg.attr('id'));
            // Define SVG position manipulation variables
            let svgPoint = parent_svg.node().createSVGPoint();
            let screenCTM = parent_rect.node().getScreenCTM();
            svgPoint.x = d3.select(d3Id(this.id)).attr('data-connector-start-x');
            svgPoint.y = d3.select(d3Id(this.id)).attr('data-connector-start-y');
            let connector_start = svgPoint.matrixTransform(screenCTM.inverse());
            console.info('Start svgPoint.x : ' + svgPoint.x);
            console.info('Start svgPoint.y : ' + svgPoint.y);
            console.info('Start matrixTransform.x : ' + connector_start.x);
            console.info('Start matrixTransform.y : ' + connector_start.y);

            let connector_end = null;

            if (this.autonomous_database_ids.length > 0) {
                for (let i = 0; i < this.autonomous_database_ids.length; i++) {
                    let autonomous_database_svg = d3.select(d3Id(this.autonomous_database_ids[i]));
                    if (autonomous_database_svg.node()) {
                        svgPoint.x = autonomous_database_svg.attr('data-connector-start-x');
                        svgPoint.y = autonomous_database_svg.attr('data-connector-start-y');
                        connector_end = svgPoint.matrixTransform(screenCTM.inverse());
                        console.info('End svgPoint.x   : ' + svgPoint.x);
                        console.info('End svgPoint.y   : ' + svgPoint.y);
                        console.info('End matrixTransform.x : ' + connector_end.x);
                        console.info('End matrixTransform.y : ' + connector_end.y);
                        let polyline = drawConnector(parent_svg, this.generateConnectorId(this.autonomous_database_ids[i], this.id),
                            {x:connector_start.x, y:connector_start.y}, {x:connector_end.x, y:connector_end.y}, true);
                    }
                }
            }

            if (this.object_storage_bucket_ids.length > 0) {
                for (let i = 0; i < this.object_storage_bucket_ids.length; i++) {
                    let object_storage_bucket_svg = d3.select(d3Id(this.object_storage_bucket_ids[i]));
                    if (object_storage_bucket_svg.node()) {
                        svgPoint.x = object_storage_bucket_svg.attr('data-connector-start-x');
                        svgPoint.y = object_storage_bucket_svg.attr('data-connector-start-y');
                        connector_end = svgPoint.matrixTransform(screenCTM.inverse());
                        console.info('End svgPoint.x   : ' + svgPoint.x);
                        console.info('End svgPoint.y   : ' + svgPoint.y);
                        console.info('End matrixTransform.x : ' + connector_end.x);
                        console.info('End matrixTransform.y : ' + connector_end.y);
                        let polyline = drawConnector(parent_svg, this.generateConnectorId(this.object_storage_bucket_ids[i], this.id),
                            {x:connector_start.x, y:connector_start.y}, {x:connector_end.x, y:connector_end.y}, true);
                    }
                }
            }
        }
        console.log();
    }

    // Return Artifact Specific Definition.
    getSvgDefinition() {
        let definition = this.newSVGDefinition(this, this.getArtifactReference());
        let first_child = this.getParent().getChildOffset(this.getArtifactReference());
        definition['svg']['x'] = first_child.dx;
        definition['svg']['y'] = first_child.dy;
        definition['svg']['width'] = this.dimensions['width'];
        definition['svg']['height'] = this.dimensions['height'];
        definition['rect']['stroke']['colour'] = stroke_colours.purple;
        definition['rect']['stroke']['dash'] = 1;
        return definition;
    }

    /*
    ** Property Sheet Load function
     */
    loadProperties() {
        let okitJson = this.getOkitJson();
        let me = this;
        $(jqId(PROPERTIES_PANEL)).load("propertysheets/service_gateway.html", () => {
            // Load Referenced Ids
            let route_table_select = $(jqId('route_table_id'));
            route_table_select.append($('<option>').attr('value', '').text(''));
            for (let route_table of okitJson.route_tables) {
                if (me.vcn_id === route_table.vcn_id) {
                    route_table_select.append($('<option>').attr('value', route_table.id).text(route_table.display_name));
                }
            }
            let autonomous_database_select = $(jqId('autonomous_database_ids'));
            for (let autonomous_database of okitJson.autonomous_databases) {
                if (me.compartment_id === autonomous_database.compartment_id) {
                    autonomous_database_select.append($('<option>').attr('value', autonomous_database.id).text(autonomous_database.display_name));
                }
            }
            let object_storage_bucket_select = $(jqId('object_storage_bucket_ids'));
            for (let object_storage_bucket of okitJson.object_storage_buckets) {
                if (me.compartment_id === object_storage_bucket.compartment_id) {
                    object_storage_bucket_select.append($('<option>').attr('value', object_storage_bucket.id).text(object_storage_bucket.display_name));
                }
            }
            // Load Properties
            loadPropertiesSheet(me.artefact);
        });
    }

    /*
    ** Load and display Value Proposition
     */
    loadValueProposition() {
        $(jqId(VALUE_PROPOSITION_PANEL)).load("valueproposition/service_gateway.html");
    }

    /*
    ** Static Functionality
     */
    static getArtifactReference() {
        return ServiceGateway.getArtifactReference();
    }

    static getDropTargets() {
        return [VirtualCloudNetwork.getArtifactReference()];
    }

}