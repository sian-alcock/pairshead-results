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
      pageIndex: 0
    }
    this.getCrewsToDisplay = this.getCrewsToDisplay.bind(this)
    this.changePage = this.changePage.bind(this)
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
    console.log('crewstodisplay', crewsToDisplay)
    return crewsToDisplay
  }

  getImage() {
    <Img
      src={['https://www.example.com/foo.jpg', '../../assets/unknown_blades.png']}
    />
  }

  render() {

    const totalPages = Math.floor((this.getCrewsToDisplay().length - 1) / this.state.pageSize)
    const pagedCrews = this.getCrewsToDisplay().slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)

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
                <td>Overall</td>
                <td>Crew ID</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Time</td>
                <td>Event</td>
                <td>Penalty</td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>Overall</td>
                <td>Crew ID</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Time</td>
                <td>Event</td>
                <td>Penalty</td>
              </tr>
            </tfoot>
            <tbody>
              {pagedCrews.map((crew, i) =>
                <tr key={crew.id}>
                  <td>{i += 1}</td>
                  <td>{crew.id}</td>
                  <td><img className="blades" src={crew.club.blade_image} alt="blade image" width="40px" /></td>
                  <td>{crew.club.name}</td>
                  <td>{crew.name}</td>
                  <td>{formatTimes(crew.race_time)}</td>
                  <td>{crew.event.name}</td>
                  <td>{crew.penalty ? 'P' : ''}</td>
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
