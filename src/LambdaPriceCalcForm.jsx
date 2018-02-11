import React, {Component} from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Panel from 'react-bootstrap/lib/Panel';
import Alert from 'react-bootstrap/lib/Alert';

class LambdaPriceCalcForm extends Component {

    constructor(props) {
        super(props);

        this.calculateValues = this.calculateValues.bind(this);

        this.state = {
            currentCostPerGBs: 0.00001667,
            currentCostPer1MRequests: 0.20,
            currentFreeTierGBs: 400000,
            currentFreeRequests: 1000000,
            executionTime: 1,
            memory: 512,
            elapsedGBs: 0,
            billableGBs: 0,
            billableRequests: 0,
            totalConsumedGBs: 0,
            executionsPerDay: 1000000,
            billableGBsBalance: false,
            billableRequestsBalance: false,
            requestCost: 0,
            calculatedCost: 0,
            totalCost: 0
        }
    }

    //calculate initial values on load
    componentDidMount() {
        this.calculateValues(null);
    }


    calculateValues(e) {
        console.log("calculating ...");

        var currentExeTime, currentMemory, currentExecutions, elapsedGBs, totalConsumedGBs,
            billableGBs, calculatedCost, billableRequests, requestCost, totalCost;

        if (e != null && e.target.name === 'exeTime') {
            currentExeTime = e.target.value;
        }
        else {
            currentExeTime = this.state.executionTime;
        }

        if (e != null && e.target.name === 'memory') {
            currentMemory = e.target.value;
        }
        else {
            currentMemory = this.state.memory;
        }

        if (e != null && e.target.name === 'executionsPerDay') {
            currentExecutions = e.target.value;
        }
        else {
            currentExecutions = this.state.executionsPerDay;
        }


        elapsedGBs =
            parseFloat(currentExeTime) * (parseFloat(currentMemory) / 1024);

        totalConsumedGBs = elapsedGBs * currentExecutions;


        //billable GB-s
        billableGBs = totalConsumedGBs - this.state.currentFreeTierGBs;
        if (billableGBs <= 0) {
            billableGBs = 0;
            calculatedCost = 0;
            this.setState({billableGBsBalance: false});
        } else {
            this.setState({billableGBsBalance: true});

            //calculate cost
            calculatedCost = parseFloat(billableGBs * this.state.currentCostPerGBs).toFixed(2);
        }

        //billable calls
        billableRequests = currentExecutions - this.state.currentFreeRequests;
        if (billableRequests <= 0) {
            billableRequests = 0;
            requestCost = 0;
            this.setState({billableRequestsBalance: false});
        } else {
            this.setState({billableRequestsBalance: true});

            //calculate cost based on rounded up to nearest 1M calls
            //if 1, then 1000000
            if (billableRequests < 1000000) {
                billableRequests = 1000000;
            } else {

                billableRequests = (Math.ceil(parseInt(billableRequests) / 1000000)) * 1000000;
            }
            requestCost = parseFloat(this.state.currentCostPer1MRequests * ( billableRequests / 1000000 )).toFixed(2);
        }

        totalCost = (parseFloat(calculatedCost) + parseFloat(requestCost)).toFixed(2);

        this.setState({
            executionTime: currentExeTime,
            memory: currentMemory,
            executionsPerDay: currentExecutions,
            billableGBs: billableGBs,
            elapsedGBs: elapsedGBs,
            totalConsumedGBs: totalConsumedGBs,
            billableRequests: billableRequests,
            calculatedCost: calculatedCost,
            requestCost: requestCost,
            totalCost: totalCost
        });
    }

    render() {
        return (
            <div>
                <Panel>
                    <Grid>
                        <Row className="show-grid">
                            <Col lg={1}></Col>
                            <Col sm={2}>
                                <label>Execution time (secs)</label>
                            </Col>
                            <Col sm={3}>
                                <input type="number" name="exeTime" onChange={this.calculateValues}
                                       value={this.state.executionTime}/>
                            </Col>
                            <Col sm={3}>

                            </Col>
                            <Col sm={3}>

                            </Col>
                        </Row>

                        <Row className="show-grid">
                            <Col lg={1}></Col>
                            <Col sm={2}>
                                <label>Memory (MB)</label>
                            </Col>
                            <Col sm={3}>
                                <input type="number" name="memory" onChange={this.calculateValues}
                                       value={this.state.memory}/>
                            </Col>

                            <Col sm={3}>
                                Elapsed GB-s
                            </Col>
                            <Col sm={3}>
                                {this.state.elapsedGBs}
                            </Col>

                        </Row>

                        <Row className="show-grid">
                            <Col lg={1}></Col>
                            <Col sm={2}>
                                <label>Requests / month</label>
                            </Col>
                            <Col sm={3}>
                                <input type="number" name="executionsPerDay" onChange={this.calculateValues}
                                       value={this.state.executionsPerDay}/>
                            </Col>

                            <Col sm={3}>
                                Consumed GB-s
                            </Col>
                            <Col sm={3}>
                                {this.state.totalConsumedGBs}
                            </Col>

                        </Row>

                    </Grid>
                </Panel>

                <Panel>
                    <Panel.Heading> Calculated Costs</Panel.Heading>
                    <Panel.Body>
                        <Panel>
                            <Grid>
                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Cost per GB-s</label>
                                    </Col>
                                    <Col sm={3}>
                                        {this.state.currentCostPerGBs}
                                    </Col>
                                    <Col sm={3}>
                                        Free Tier GB-s
                                    </Col>
                                    <Col sm={3}>
                                        {this.state.currentFreeTierGBs}
                                    </Col>
                                </Row>

                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Billable GB-s</label>
                                    </Col>
                                    <Col sm={3}>
                                        {this.state.billableGBs}
                                    </Col>

                                    <Col sm={3}>
                                    </Col>
                                    <Col sm={3}>
                                    </Col>
                                </Row>
                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Compute cost per month</label>
                                    </Col>
                                    <Col sm={3}>
                                        ${this.state.calculatedCost}
                                    </Col>

                                    <Col sm={6}>
                                        {
                                            this.state.billableGBsBalance === true &&
                                            <Alert bsStyle="warning">
                                                Your consumed {this.state.totalConsumedGBs} GB-s is above the Free
                                                Tier of 400,000 so you are charged for the difference
                                                of {this.state.billableGBs} GB-s used!
                                            </Alert>
                                        }
                                        {
                                            this.state.billableGBsBalance === false &&
                                            <Alert bsStyle="success">
                                                Your consumed {this.state.totalConsumedGBs} GB-s is below the
                                                Free Tier of 400,000 so there is no charge for this usage!
                                            </Alert>
                                        }
                                    </Col>
                                </Row>
                            </Grid>
                        </Panel>
                        <Panel>
                            <Grid>
                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Cost per 1M requests</label>
                                    </Col>
                                    <Col sm={3}>
                                        {this.state.currentCostPer1MRequests}
                                    </Col>

                                    <Col sm={3}>
                                        Free Tier requests
                                    </Col>
                                    <Col sm={3}>
                                        First 1,000,000
                                    </Col>
                                </Row>

                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Billable requests</label>
                                    </Col>
                                    <Col sm={3}>
                                        {this.state.billableRequests}
                                    </Col>

                                    <Col sm={3}>
                                    </Col>
                                    <Col sm={3}>
                                    </Col>
                                </Row>

                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Request cost per month</label>
                                    </Col>
                                    <Col sm={3}>
                                        ${this.state.requestCost}
                                    </Col>

                                    <Col sm={6}>
                                        {
                                            this.state.billableRequestsBalance === true &&
                                            <Alert bsStyle="warning">
                                                Your {this.state.executionsPerDay} requests are above the
                                                Free tier of 1,000,000 so you will be charged 0.20 for each of
                                                your {this.state.billableRequests} per 1M.s
                                            </Alert>
                                        }
                                        {
                                            this.state.billableRequestsBalance === false &&
                                            <Alert bsStyle="success">
                                                Your {this.state.executionsPerDay} requests are below the free tier of
                                                1,000,000 so
                                                there's no
                                                additional charge for your requests.
                                            </Alert>
                                        }
                                    </Col>
                                </Row>
                            </Grid>
                        </Panel>
                        <Panel>
                            <Grid>
                                <Row className="show-grid">
                                    <Col lg={1}></Col>
                                    <Col sm={2}>
                                        <label>Total Cost per month</label>
                                    </Col>
                                    <Col sm={3}>
                                        ${this.state.totalCost}
                                    </Col>

                                    <Col sm={3}>
                                    </Col>
                                    <Col sm={3}>
                                    </Col>
                                </Row>
                            </Grid>
                        </Panel>
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
}

export default LambdaPriceCalcForm;