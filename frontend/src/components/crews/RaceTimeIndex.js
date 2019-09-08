import React from 'react'
import axios from 'axios'
// import { Link } from 'react-router-dom'

class RaceTimeIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      race_times: []
    }
  }

  componentDidMount() {
    axios.get('/api/race-times/')
      .then(res => this.setState({ race_times: res.data}))
  }

  render() {

    console.log(this.state.crews)

    return (
      <section className="section">
        <div className="container">
          <h1>RaceTime Index</h1>
        </div>
      </section>
    )
  }
}

export default RaceTimeIndex
