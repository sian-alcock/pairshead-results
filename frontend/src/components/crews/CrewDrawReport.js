import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { getImage } from '../../lib/helpers'


const _ = require('lodash').runInContext()


class CrewDrawReport extends React.Component {
  constructor() {
    super()
    this.state = {
      crews: [],
      crewsToDisplay: []
    }

    this.combineFiltersAndSort = this.combineFiltersAndSort.bind(this)
  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState(
        { crews: res.data, crewsToDisplay: res.data },
        () => this.combineFiltersAndSort(this.state.crews))
      )
  }


  combineFiltersAndSort(filteredCrews) {
    _.indexOf = _.findIndex
    const sortedCrews = _.orderBy(filteredCrews, 'bib_number', 'asc')
    return this.setState({ crewsToDisplay: sortedCrews })

  }

  render() {

    !this.state.crewsToDisplay ? <h2>loading...</h2> : console.log(this.state.crewsToDisplay)

    return (
      <section className="section">
        <div className="container">

          <table className="table">
            <thead>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Blade</td>
                <td>Bib</td>
                <td>Club</td>
                <td>Category</td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Crew ID</td>
                <td>Crew</td>
                <td>Status</td>
                <td>Blade</td>
                <td>Bib</td>
                <td>Club</td>
                <td>Category</td>
              </tr>
            </tfoot>
            <tbody>
              {this.state.crewsToDisplay.map(crew =>
                <tr key={crew.id}>
                  <td><Link to={`/crews/${crew.id}`}>{crew.id}</Link></td>
                  <td>{!crew.competitor_names ? crew.name : crew.competitor_names}</td>
                  <td>{crew.status}</td>
                  <td>{getImage(crew)}</td>
                  <td>{!crew.bib_number ? '' : crew.bib_number}</td>
                  <td>{crew.club.index_code}</td>
                  <td>{crew.event_band}</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </section>
    )
  }
}

export default CrewDrawReport
