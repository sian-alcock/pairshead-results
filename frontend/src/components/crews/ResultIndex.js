import React from 'react'
import axios from 'axios'
import { formatTimes } from '../../lib/helpers'
import Img from 'react-image'
import Paginator from '../common/Paginator'

class ResultIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      crews: [],
      pageSize: 20,
      pageIndex: 0,
      crewsInCategory: []
    }
    this.getCrewsToDisplay = this.getCrewsToDisplay.bind(this)
    this.changePage = this.changePage.bind(this)
    this.getCrewsInCategory = this.getCrewsInCategory.bind(this)
    // this.getRank = this.getRank.bind(this)
  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState({ crews: res.data }))
  }

  changePage(pageIndex, totalPages) {
    if (
      pageIndex > totalPages ||
    pageIndex < 0
    ) return null
    this.setState({ pageIndex })
  }

  getCrewsToDisplay() {
    const filteredCrews = this.state.crews.filter(crew => crew.raw_time !== null)
    const crewsToDisplay = filteredCrews.sort((a, b) => (a.race_time > b.race_time) ? 1 : -1)
    return crewsToDisplay
  }

  getImage() {
    <Img
      src={['https://www.example.com/foo.jpg', '../../assets/unknown_blades.png']}
    />
  }

  getRank(crew, crews) {
    const raceTimes = crews.map(crew => crew.race_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const rank = sorted.indexOf(crew.race_time) + 1
    return rank
  }

  getCrewsInCategory(event, crewsToDisplay){
    const crewsInCategory = crewsToDisplay.filter(crew => crew.event_band === event)
    return crewsInCategory
  }

  render() {
    const totalPages = Math.floor((this.getCrewsToDisplay().length - 1) / this.state.pageSize)
    const pagedCrews = this.getCrewsToDisplay().slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)
    console.log(this.getCrewsToDisplay())

    return (

      <section className="section">
        <div className="container">

          <Paginator
            pageIndex={this.state.pageIndex}
            totalPages={totalPages}
            changePage={this.changePage}
          />


          <table className="table">
            <thead>
              <tr>
                <td>Overall position</td>
                <td>Crew ID</td>
                <td>Time</td>
                <td>Masters adjust</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Composite code</td>
                <td>Event</td>
                <td>Pos in category</td>
                <td>Penalty</td>
                <td>TO</td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Overall position</td>
                <td>Crew ID</td>
                <td>Time</td>
                <td>Masters adjust</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Composite code</td>
                <td>Event</td>
                <td>Pos in category</td>
                <td>Penalty</td>
                <td>TO</td>
              </tr>
            </tfoot>
            <tbody>
              {pagedCrews.map((crew) =>
                <tr key={crew.id}>
                  <td>{this.getRank(crew, this.getCrewsToDisplay())}</td>
                  <td>{crew.id}</td>
                  <td>{formatTimes(crew.race_time)}</td>
                  <td>{!crew.masters_adjusted_time ? '' : formatTimes(crew.masters_adjusted_time)}</td>
                  <td><img className="blades" src={crew.club.blade_image} alt="blade image" width="40px" /></td>
                  <td>{crew.club.name}</td>
                  <td>{crew.competitor_names}</td>
                  <td>{crew.composite_code}</td>
                  <td>{crew.event_band}</td>
                  <td>{this.getRank(crew, this.getCrewsInCategory(crew.event_band, this.getCrewsToDisplay()))}</td>
                  <td>{crew.penalty ? 'P' : ''}</td>
                  <td>{crew.time_only ? 'TO' : ''}</td>
                </tr>
              )}
            </tbody>
          </table>

          <Paginator
            pageIndex={this.state.pageIndex}
            totalPages={totalPages}
            changePage={this.changePage}
          />

        </div>
      </section>
    )
  }
}

export default ResultIndex
