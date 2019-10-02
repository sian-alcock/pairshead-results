import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { formatTimes } from '../../lib/helpers'
import Img from 'react-image'
import Paginator from '../common/Paginator'

const _ = require('lodash').runInContext()

class ResultIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      crews: [],
      pageSize: 20,
      pageIndex: 0,
      crewsInCategory: [],
      crewsToDisplay: []
    }

    this.changePage = this.changePage.bind(this)
    this.getCrewsInCategory = this.getCrewsInCategory.bind(this)
    this.combineFiltersAndSort = this.combineFiltersAndSort.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)

  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState({ crews: res.data },
        () => this.combineFiltersAndSort(this.state.crews))
      )
  }

  changePage(pageIndex, totalPages) {
    if (
      pageIndex > totalPages ||
    pageIndex < 0
    ) return null
    this.setState({ pageIndex })
  }

  getImage() {
    <Img
      src={['https://www.example.com/foo.jpg', '../../assets/unknown_blades.png']}
    />
  }

  getOverallRank(crew, crews) {
    const raceTimes = crews.map(crew => crew.published_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const rank = sorted.indexOf(crew.published_time) + 1
    return rank
  }

  getCategoryRank(crew, crews) {
    const raceTimes = crews.map(crew => crew.category_position_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const rank = sorted.indexOf(crew.category_position_time) + 1
    return !rank ? '' : rank
  }

  getCrewsInCategory(event, crewsToDisplay){
    // For the position in category, filter by crews in each event_band (category) but exclude crews marked as 'time only'.
    const crewsInCategory = crewsToDisplay.filter(crew => crew.event_band === event && !crew.time_only)
    return crewsInCategory
  }

  getCategories(){
    // Populate the category (event_band) pull down with all event_bands
    let eventBands = this.state.crews.map(crew => crew.event_band)
    eventBands = Array.from(new Set(eventBands))
    const options = eventBands.map(option => {
      return {label: option, value: option}
    })
    console.log(options)
    return [{label: '', value: ''}, ...options]
  }

  handleSearchKeyUp(e){
    this.setState({
      searchTerm: e.target.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleSelectChange(selectedOption){
    console.log(selectedOption.value)
    this.setState({
      category: selectedOption.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  combineFiltersAndSort(filteredCrews) {
    let filteredBySearchText
    let filteredByCategory


    // Only ever include crews with a published time
    const filteredByValidRaceTime = this.state.crews.filter(crew => crew.published_time > 0)

    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.crews
    } else {
      filteredBySearchText = this.state.crews.filter(crew => re.test(crew.name) || re.test(crew.club) || re.test(crew.id) || re.test(crew.competitors_names) || re.test(!crew.event_band ? '' : crew.event_band))
    }

    if(this.state.category) {
      filteredByCategory = this.state.crews.filter(crew => crew.event_band === this.state.category)
    } else {
      filteredByCategory = this.state.crews
    }

    _.indexOf = _.findIndex
    filteredCrews = _.intersection(filteredByValidRaceTime,  filteredBySearchText, filteredByCategory)

    const sortedCrews = filteredCrews.sort((a, b) => (a.published_time > b.published_time) ? 1 : -1)
    return this.setState({ crewsToDisplay: sortedCrews, pageIndex: 0 })

  }

  render() {
    const totalPages = Math.floor((this.state.crewsToDisplay.length - 1) / this.state.pageSize)
    const pagedCrews = this.state.crewsToDisplay.slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)
    console.log(this.state.crewsToDisplay)

    return (

      <section className="section">
        <div className="container">

          <div className="columns no-print">

            <div className="column">
              <div className="field control has-icons-left">
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
                <input className="input" id="search" placeholder="search" onKeyUp={this.handleSearchKeyUp} />
              </div>
            </div>

            <div className="column">

              <div className="field">
                <div className="control">
                  <Select
                    id="category"
                    onChange={this.handleSelectChange}
                    options={this.getCategories()}
                  />
                </div>
              </div>
            </div>

          </div>

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
                  <td>{this.getOverallRank(crew, this.state.crewsToDisplay)}</td>
                  <td>{crew.id}</td>
                  <td>{formatTimes(crew.published_time)}</td>
                  <td>{!crew.masters_adjusted_time ? '' : formatTimes(crew.masters_adjusted_time)}</td>
                  <td><img className="blades" src={crew.club.blade_image} alt="blade image" width="40px" /></td>
                  <td>{crew.club.name}</td>
                  <td>{crew.competitor_names}</td>
                  <td>{crew.composite_code}</td>
                  <td>{crew.event_band}</td>
                  <td>{this.getCategoryRank(crew, this.getCrewsInCategory(crew.event_band, this.state.crewsToDisplay))}</td>
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
