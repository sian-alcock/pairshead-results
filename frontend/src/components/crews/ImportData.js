import React from 'react'
import TimeLoader from '../common/ImportTimeData'
import ClubEventLoader from '../common/ImportClubEventData'
import CrewLoader from '../common/ImportCrewData'
import CompetitorLoader from '../common/ImportCompetitorData'

class ImportData extends React.Component {


  render() {

    return (
      <section className="section">
        <div className="container">


          <div className="box">
            <ClubEventLoader/>
          </div>

          <div className="box">
            <CrewLoader/>
          </div>

          <div className="box">
            <CompetitorLoader/>
          </div>

          <div className="box">
            <TimeLoader/>
          </div>

        </div>
      </section>
    )
  }
}

export default ImportData
