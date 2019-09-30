import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

class Home extends React.Component {
  constructor() {
    super()
    this.state= {
      crews: []
    }

    this.getCrewsWithTimes = this.getCrewsWithTimes.bind(this)
    this.getCrewsWithoutTimes = this.getCrewsWithoutTimes.bind(this)
    this.getTotalCrews = this.getTotalCrews.bind(this)
    this.getScratchedCrewsWithTimes = this.getScratchedCrewsWithTimes.bind(this)
    this.exportCrewData = this.exportCrewData.bind(this)
  }

  componentDidMount() {
    axios.get('/api/crews')
      .then(res => this.setState({ crews: res.data}))
  }

  getCrewsWithTimes(){
    const crewsWithTimes = this.state.crews.filter(crew => crew.status !== 'Scratched' && crew.times.length === 2)
    return crewsWithTimes.length
  }

  getCrewsWithoutTimes(){
    const crewsWithoutTimes = this.state.crews.filter(crew => crew.status !== 'Scratched' && crew.times.length !== 2)
    return crewsWithoutTimes.length
  }

  getScratchedCrewsWithTimes(){
    const scratchedCrewsWithTimes = this.state.crews.filter(crew => crew.status === 'Scratched' && crew.times.length === 2)
    return scratchedCrewsWithTimes.length
  }

  getTotalCrews(){
    return this.state.crews.length
  }

  getAcceptedCrews(){
    const acceptedCrews = this.state.crews.filter(crew => crew.status === 'Accepted')
    return acceptedCrews.length
  }

  getScratchedCrews(){
    const acceptedCrews = this.state.crews.filter(crew => crew.status === 'Scratched')
    return acceptedCrews.length
  }

  exportCrewData(){
    window.open('api/crew-data-export/')
  }

  render() {

    return (
      <section className="section">
        <div className="container">
          <div className="columns is-centered">

            <div className="column has-text-centered">
              <Link
                to={{
                  pathname: '/import'
                }}>
                <button className="button is-primary">
                  Import data
                </button>
              </Link>
            </div>

            <div className="column has-text-centered">
              <Link
                to={{
                  pathname: '/race-times',
                  state: { startTab: true, finishTab: false }
                }}>
                <button className="button is-primary">
                  Fix Start Sequence
                </button>
              </Link>
            </div>

            <div className="column has-text-centered">
              <Link
                to={{
                  pathname: '/race-times',
                  state: { startTab: false, finishTab: true }
                }}>
                <button className="button is-primary">
                Fix Finish Sequence
                </button>
              </Link>
            </div>
          </div>

          <div className="box">
            <h2 className="subtitle has-text-centered">Summary</h2>
          </div>


          <div className="columns is-centered">
            <div className="column">
              <p>Total crews</p>
            </div>
            <div className="column">
              <p>{this.getTotalCrews()}</p>
            </div>
            <div className="column">
              <p>Crews with times</p>
            </div>
            <div className="column">
              <p>{this.getCrewsWithTimes()}</p>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column">
              <p>Accepted crews</p>
            </div>
            <div className="column">
              <p>{this.getAcceptedCrews()}</p>
            </div>
            <div className="column">
              <p>Crews without times</p>
            </div>
            <div className="column">
              <p>{this.getCrewsWithoutTimes()}</p>
            </div>
          </div>

          <div className="columns is-centered">
            <div className="column">
              <p>Scratched crews</p>
            </div>
            <div className="column">
              <p>{this.getScratchedCrews()}</p>
            </div>
            <div className="column">
              <p>Scratched crews that have a time</p>
            </div>
            <div className="column">
              <p>{this.getScratchedCrewsWithTimes()}</p>
            </div>
          </div>

          <div className="box">
            <h2 className="subtitle has-text-centered">Prepare Results</h2>
          </div>

          <div className="columns">
            <div className="column has-text-centered">
              <button className="button is-primary">Results Overview</button>
            </div>
            <div className="column has-text-centered">
              <button className="button is-primary">Calculate Handicaps</button>
            </div>
            <div className="column has-text-centered">
              <button className="button is-primary" onClick={this.exportCrewData}>Export crew data</button>
            </div>
            <div className="column has-text-centered">
              <button className="button is-primary">Submit BROE Results</button>
            </div>
          </div>

        </div>
      </section>
    )
  }
}

export default Home
