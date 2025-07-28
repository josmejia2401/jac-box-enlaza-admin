import * as React from 'react';
import "./styles.css";
import UserStatsDashboard from './components/user-stats-dashboard';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() { }

    componentWillUnmount() { }

    render() {
        return (<UserStatsDashboard></UserStatsDashboard>);
    }
}
export default Page;