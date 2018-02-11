import React, {Component} from 'react';
import LambdaPriceCalcForm from './LambdaPriceCalcForm';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">AWS Lambda Usage Cost Calculator</h1>
                    <p>AWS Lambda usage is charged per GB second of usage. If a Lambda configured to use 1GB and it
                        executes for 1 second, this is 1 GB-sec.</p>
                    <p>The Free Tier which continues indefinitly (even after your AWS Free Tier ends) also includes:</p>
                    <ul>
                        <li>400,000 GB-s free per month</li>
                        <li>1,000,000 requests free per month</li>
                    </ul>
                    <p>Enter values for execution time, memory usage (in MB) and requests per month to calculate
                        approximate
                        monthly usage costs:</p>
                    <p>by Kevin Hooke <a
                        href="https://twitter.com/intent/tweet?screen_name=kevinhooke&ref_src=twsrc%5Etfw"
                        className="twitter-mention-button"
                        data-show-count="false">Tweet to @kevinhooke</a>
                    </p>
                </header>

                <LambdaPriceCalcForm/>

            </div>
        );
    }
}

export default App;
