import React from 'react'
import Select from 'react-select'
import axios from 'axios'
import { formatTimes, getImage } from '../../lib/helpers'
import Paginator from '../common/Paginator'

const _ = require('lodash').runInContext()

class ResultIndex extends React.Component {
  constructor() {
    super()
    this.state= {
      crews: [],
      pageSize: 20,
      pageIndex: 0,
      searchTerm: sessionStorage.getItem('resultIndexSearch') || '',
      crewsInCategory: [],
      crewsToDisplay: [],
      filteredByValidRaceTime: [],
      positionFilteredByGender: []
    }

    this.changePage = this.changePage.bind(this)
    this.getCrewsInCategory = this.getCrewsInCategory.bind(this)
    this.combineFiltersAndSort = this.combineFiltersAndSort.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handlePagingChange = this.handlePagingChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.handleFirstAndSecondCrews = this.handleFirstAndSecondCrews.bind(this)
    this.handleCloseCrews = this.handleCloseCrews.bind(this)

  }

  componentDidMount() {
    axios.get('/api/crews/')
      .then(res => this.setState({ crews: res.data, filteredByValidRaceTime: res.data.filter(crew => crew.status === 'Accepted' && crew.published_time > 0) },
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

  getOverallRank(crew, crews) {
    const raceTimes = crews.map(crew => crew.published_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const rank = sorted.indexOf(crew.published_time) + 1
    return rank
  }

  getCategoryRank(crew, crews) {
    // category_position_time combines published time and masters adjusted time as the latter only counts in the position in category
    const raceTimes = crews.map(crew => crew.category_position_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const rank = sorted.indexOf(crew.category_position_time) + 1
    return !rank ? '' : rank
  }

  getCrewsInCategory(event, crews){
    // For the position in category, filter by crews in each event_band (category) but exclude crews marked as 'time only'.
    const crewsInCategory = crews.filter(crew => crew.event_band === event && !crew.time_only)
    return crewsInCategory
  }

  getTopCrews(event, crews) {
    const crewsInCategory = crews.filter(crew => crew.event_band === event && !crew.time_only)
    const raceTimes = crewsInCategory.map(crew => crew.category_position_time)
    const sorted = raceTimes.slice().sort((a,b) => a - b)
    const flagForReview = Math.abs(sorted[0]-sorted[1]) <= 2000 ? true : false
    return flagForReview
  }

  getCategories(){
    // Populate the category (event_band) pull down with all event_bands
    let eventBands = this.state.crews.map(crew => crew.event_band)
    eventBands = Array.from(new Set(eventBands)).sort()
    const options = eventBands.map(option => {
      return {label: option, value: option}
    })
    return [{label: '', value: ''}, ...options]
  }

  handleSearchKeyUp(e){
    sessionStorage.setItem('resultIndexSearch', e.target.value)
    this.setState({
      searchTerm: e.target.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleCategoryChange(selectedOption){
    this.setState({
      category: selectedOption.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handlePagingChange(selectedOption){
    this.setState({
      pageSize: selectedOption.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleGenderChange(selectedOption){
    this.setState({
      gender: selectedOption.value
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleFirstAndSecondCrews(e){
    this.setState({
      firstAndSecondCrewsBoolean: e.target.checked
    }, () => this.combineFiltersAndSort(this.state.crews))
  }

  handleCloseCrews(e){
    this.setState({
      closeFirstAndSecondCrewsBoolean: e.target.checked
    })
  }

  combineFiltersAndSort(filteredCrews) {
    let filteredBySearchText
    let filteredByCategory
    let filteredByCloseFirstAndSecondCrews
    let filteredByGender
    let sortedCrews

    // Create filter based on Regular expression of the search term
    const re= new RegExp(this.state.searchTerm, 'i')

    if(!this.state.searchTerm) {
      filteredBySearchText = this.state.crews
    } else {
      filteredBySearchText = this.state.crews.filter(crew => re.test(crew.name) || re.test(crew.club) || re.test(crew.id) || re.test(crew.bib_number) || re.test(crew.competitor_names) || re.test(!crew.event_band ? '' : crew.event_band))
    }

    if(this.state.category) {
      filteredByCategory = this.state.crews.filter(crew => crew.event_band === this.state.category)
    } else {
      filteredByCategory = this.state.crews
    }

    if(this.state.gender === 'all' || !this.state.gender) {
      filteredByGender = this.state.crews
    } else {
      filteredByGender = this.state.crews.filter(crew => crew.event.gender === this.state.gender)
    }
    this.setState({positionFilteredByGender: _.intersection(this.state.filteredByValidRaceTime, filteredByGender)})

    if(this.state.firstAndSecondCrewsBoolean) {
      filteredByCloseFirstAndSecondCrews = this.state.crews.filter(crew => this.getCategoryRank(crew, this.getCrewsInCategory(crew.event_band, this.state.crewsToDisplay)) === 1 || this.getCategoryRank(crew, this.getCrewsInCategory(crew.event_band, this.state.crewsToDisplay)) === 2)
    } else {
      filteredByCloseFirstAndSecondCrews = this.state.crews
    }

    _.indexOf = _.findIndex
    filteredCrews = _.intersection(this.state.filteredByValidRaceTime,  filteredBySearchText, filteredByCategory, filteredByCloseFirstAndSecondCrews, filteredByGender)

    // As a rule, sort by shortest race_time but when showing 1st and second crews, sort by event
    if(this.state.firstAndSecondCrewsBoolean) {
      sortedCrews = _.orderBy(filteredCrews, ['event_band', 'published_time'], ['asc', 'asc'])
    } else {
      sortedCrews = _.orderBy(filteredCrews, ['published_time'], ['asc'])
    }


    return this.setState({ crewsToDisplay: sortedCrews, pageIndex: 0 })

  }

  render() {
    const totalPages = Math.floor((this.state.crewsToDisplay.length - 1) / this.state.pageSize)
    const pagedCrews = this.state.crewsToDisplay.slice(this.state.pageIndex * this.state.pageSize, (this.state.pageIndex + 1) * this.state.pageSize)
    const pagingOptions = [{label: '20 crews', value: '20'}, {label: '50 crews', value: '50'}, {label: '100 crews', value: '100'}, {label: 'All crews', value: '500'}]
    const genderOptions = [{label: 'All', value: 'all'}, {label: 'Open', value: 'Open'}, {label: 'Female', value: 'Female'}, {label: 'Mixed', value: 'Mixed'}]

    return (

      <section className="section">
        <div className="container">

          <div className="columns no-print">

            <div className="column">
              <div className="field control has-icons-left">
                <span className="icon is-left">
                  <i className="fas fa-search"></i>
                </span>
                <input className="input" id="search" placeholder="Search" value={this.state.searchTerm} onChange={this.handleSearchKeyUp} />
              </div>
            </div>

            <div className="column">

              <div className="field">
                <div className="control">
                  <Select
                    id="category"
                    onChange={this.handleCategoryChange}
                    options={this.getCategories()}
                    placeholder='Category'
                  />
                </div>
              </div>
            </div>

            <div className="column">

              <div className="field">
                <div className="control">
                  <Select
                    id="paging"
                    onChange={this.handlePagingChange}
                    options={pagingOptions}
                    placeholder='Page size'
                  />
                </div>
              </div>
            </div>

            <div className="column">

              <div className="field">
                <div className="control">
                  <Select
                    id="gender"
                    onChange={this.handleGenderChange}
                    options={genderOptions}
                    placeholder='Gender'
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="crewsWithoutStartTime" onClick={this.handleFirstAndSecondCrews} />
                  <small>Crews in 1st and 2nd place</small>
                </label>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="checkbox" >
                  <input type="checkbox"  className="checkbox" value="highlightCloseCrews" onClick={this.handleCloseCrews} />
                  <small>Highlight 1st/2nd crews within 2s ❓</small>
                </label>
              </div>
            </div>

          </div>
          <div className="no-print">
            <Paginator
              pageIndex={this.state.pageIndex}
              totalPages={totalPages}
              changePage={this.changePage}
            />
          </div>
          <div className="list-totals no-print"><small>{this.state.crewsToDisplay.length} of {this.state.filteredByValidRaceTime.length} results</small></div>
          <table className="table">
            <thead>
              <tr>
                <td>Overall position</td>
                <td>Number</td>
                <td>Time</td>
                <td>Masters adjust</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Composite code</td>
                <td>Event</td>
                <td colSpan='2'>Pos in category</td>
                <td>Penalty</td>
                <td>TO</td>
              </tr>
            </thead>
            <tfoot className="no-print">
              <tr>
                <td>Overall position</td>
                <td>Number</td>
                <td>Time</td>
                <td>Masters adjust</td>
                <td colSpan='2'>Rowing club</td>
                <td>Crew</td>
                <td>Composite code</td>
                <td>Event</td>
                <td colSpan='2'>Pos in category</td>
                <td>Penalty</td>
                <td>TO</td>
              </tr>
            </tfoot>
            <tbody>
              {pagedCrews.map((crew) =>
                <tr key={crew.id}>
                  <td>{!this.state.gender || this.state.gender === 'all' ? this.getOverallRank(crew, this.state.filteredByValidRaceTime) : this.getOverallRank(crew, this.state.positionFilteredByGender)}</td>
                  <td>{crew.bib_number}</td>
                  <td>{formatTimes(crew.published_time)}</td>
                  <td>{!crew.masters_adjusted_time ? '' : formatTimes(crew.masters_adjusted_time)}</td>
                  <td>{getImage(crew)}</td>
                  <td>{crew.club.name}</td>
                  <td>{crew.competitor_names}</td>
                  <td>{crew.composite_code}</td>
                  <td>{crew.event_band}</td>
                  <td>{this.getCategoryRank(crew, this.getCrewsInCategory(crew.event_band, this.state.filteredByValidRaceTime))}</td>
                  <td>{this.getTopCrews(crew.event_band, this.state.filteredByValidRaceTime) && this.state.closeFirstAndSecondCrewsBoolean ? '❓' : ''}</td>
                  <td>{crew.penalty ? 'P' : ''}</td>
                  <td>{crew.time_only ? 'TO' : ''}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="no-print">
            <Paginator
              pageIndex={this.state.pageIndex}
              totalPages={totalPages}
              changePage={this.changePage}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default ResultIndex
