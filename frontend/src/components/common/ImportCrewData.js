import React, { Component } from 'react'
import axios from 'axios'
import { formatTimeDate } from '../../lib/helpers'

class CrewLoader extends Component {
  constructor() {
    super()

    this.state = {
      loading: false,
      crewDataUpdated: ''
    }

    this.getData = this.getData.bind(this)

  }

  async getData() {

    this.setState({ loading: true })

    try {

      const crews = await axios.get('/api/crew-data-import/')
      console.log(crews.data)

      this.setState({ crewDataUpdated: Date.now(), loading: false })

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
          /> Loading ...</span>}
          {!loading && <span>Get Crew data</span>}

        </button>
        <p><small>{!this.state.crewDataUpdated ? '' : `Updated: ${formatTimeDate(this.state.crewDataUpdated)}`}</small></p>
      </div>
    )
  }
}

export default CrewLoader
