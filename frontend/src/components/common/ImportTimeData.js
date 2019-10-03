import React, { Component } from 'react'
import axios from 'axios'
import { formatTimeDate } from '../../lib/helpers'

class TimeLoader extends Component {


  constructor() {
    super()

    this.state = {
      loading: false,
      raceTimesDataUpdated: ''
    }

    this.getData = this.getData.bind(this)
  }

  async getData() {

    this.setState({ loading: true })

    try {

      const times = await axios.get('/api/crew-race-times')
      console.log(times.data)

      this.setState({ raceTimesDataUpdated: Date.now(), loading: false })

    } catch (e) {
      console.error(e)
    }
  }

  render() {
    const { loading } = this.state

    return (
      <div>
        <button className="button is-primary" onClick={this.getData} disabled={loading}>

          {loading && <span className="spinner"><i
            className="fas fa-spinner fa-spin"
          />Loading ...</span>}
          {!loading && <span>Get race times</span>}
        </button>

        <p><small>{!this.state.raceTimesDataUpdated ? '' : `Updated: ${formatTimeDate(this.state.raceTimesDataUpdated)}`}</small></p>
      </div>
    )
  }
}

export default TimeLoader
